import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import Classification from "@/models/Classification";
import Education from "@/models/Education";
import { handleCors } from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 ${req.method} /api/admin/stats`);

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing authorization header");
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    console.log("📈 Fetching admin statistics...");

    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      console.log("❌ Non-admin user attempted to access admin stats:", user?.email);
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    console.log("👑 Admin stats access granted for:", user.email);

    // Get basic counts
    const [totalUsers, totalClassifications, totalEducationContent] = await Promise.all([User.countDocuments(), Classification.countDocuments(), Education.countDocuments()]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Promise.all([
      // New users per day
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            newUsers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Classifications per day
      Classification.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            classifications: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Merge activity data
    const activityMap = new Map();

    recentActivity[0].forEach((item) => {
      activityMap.set(item._id, { date: item._id, newUsers: item.newUsers, classifications: 0 });
    });

    recentActivity[1].forEach((item) => {
      const existing = activityMap.get(item._id);
      if (existing) {
        existing.classifications = item.classifications;
      } else {
        activityMap.set(item._id, { date: item._id, newUsers: 0, classifications: item.classifications });
      }
    });

    const mergedActivity = Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Get classification statistics
    const classificationStats = await Classification.aggregate([
      {
        $group: {
          _id: "$classificationResult",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get top active users
    const topUsers = await Classification.aggregate([
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          count: 1,
          "user.displayName": 1,
          "user.email": 1,
        },
      },
    ]);

    console.log("✅ Admin statistics compiled successfully");

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalClassifications,
        totalEducationContent,
        recentActivity: mergedActivity,
        classificationStats,
        topUsers,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching admin stats:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to fetch admin statistics",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
