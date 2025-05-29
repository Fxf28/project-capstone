import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import { handleCors } from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 ${req.method} /api/admin/users`);

  if (req.method === "GET") {
    return await handleGetUsers(req, res);
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

async function handleGetUsers(req: NextApiRequest, res: NextApiResponse) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing authorization header");
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    console.log("🔐 Verifying admin access...");

    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const adminUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!adminUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!adminUser.isAdmin) {
      console.log("❌ Non-admin user attempted to access admin endpoint:", adminUser.email);
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    console.log("👑 Admin access granted for:", adminUser.email);

    const { page = 1, limit = 50, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};

    if (search && typeof search === "string") {
      filter.$or = [{ email: { $regex: search, $options: "i" } }, { displayName: { $regex: search, $options: "i" } }];
    }

    // Get users with pagination (exclude sensitive Firebase UID from response)
    const users = await User.find(filter)
      .select("-firebaseUid") // Exclude sensitive data
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const total = await User.countDocuments(filter);

    console.log(`✅ Found ${users.length} users for admin view`);

    return res.status(200).json({
      success: true,
      data: {
        users: users.map((user) => ({
          uid: user._id, // Use MongoDB _id instead of firebaseUid
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching users:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
