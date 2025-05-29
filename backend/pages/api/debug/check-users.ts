import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import { handleCors } from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return;
  }

  console.log(`📥 ${req.method} /api/debug/check-users`);

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    console.log("🔍 Checking user database...");
    await connectToMongoose();

    // Get all users
    const allUsers = await User.find().sort({ createdAt: 1 });

    // Group by email to find duplicates
    const emailCounts = new Map();
    const uidCounts = new Map();

    allUsers.forEach((user) => {
      // Count by email
      emailCounts.set(user.email, (emailCounts.get(user.email) || 0) + 1);

      // Count by UID
      if (user.firebaseUid) {
        uidCounts.set(user.firebaseUid, (uidCounts.get(user.firebaseUid) || 0) + 1);
      }
    });

    // Find duplicates
    const duplicateEmails = [];
    const duplicateUids = [];

    for (const [email, count] of emailCounts.entries()) {
      if (count > 1) {
        const users = allUsers.filter((u) => u.email === email);
        duplicateEmails.push({
          email,
          count,
          users: users.map((u) => ({
            id: u._id,
            firebaseUid: u.firebaseUid,
            createdAt: u.createdAt,
            isAdmin: u.isAdmin,
          })),
        });
      }
    }

    for (const [uid, count] of uidCounts.entries()) {
      if (count > 1) {
        const users = allUsers.filter((u) => u.firebaseUid === uid);
        duplicateUids.push({
          firebaseUid: uid,
          count,
          users: users.map((u) => ({
            id: u._id,
            email: u.email,
            createdAt: u.createdAt,
          })),
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: allUsers.length,
        duplicateEmails,
        duplicateUids,
        summary: {
          uniqueEmails: emailCounts.size,
          uniqueUids: uidCounts.size,
          hasDuplicates: duplicateEmails.length > 0 || duplicateUids.length > 0,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Error checking users:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
