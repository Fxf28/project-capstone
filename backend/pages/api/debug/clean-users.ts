import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import { handleCors } from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return;
  }

  console.log(`📥 ${req.method} /api/debug/clean-users`);

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    console.log("🧹 Cleaning duplicate users...");
    await connectToMongoose();

    // Find all users
    const allUsers = await User.find().sort({ createdAt: 1 });
    console.log(`📊 Total users found: ${allUsers.length}`);

    // Group by email
    const emailGroups = new Map();

    allUsers.forEach((user) => {
      if (!emailGroups.has(user.email)) {
        emailGroups.set(user.email, []);
      }
      emailGroups.get(user.email).push(user);
    });

    const duplicateEmails = [];
    const cleanupResults = [];

    // Process each email group
    for (const [email, users] of emailGroups.entries()) {
      if (users.length > 1) {
        duplicateEmails.push({ email, count: users.length });
        console.log(`🔍 Found ${users.length} users with email: ${email}`);

        // Keep the first user (oldest), remove others
        const keepUser = users[0];
        const removeUsers = users.slice(1);

        for (const userToRemove of removeUsers) {
          console.log(`🗑️ Removing duplicate user: ${userToRemove._id}`);
          await User.findByIdAndDelete(userToRemove._id);
          cleanupResults.push({
            removed: userToRemove._id,
            email: userToRemove.email,
            kept: keepUser._id,
          });
        }
      }
    }

    const finalCount = await User.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        originalCount: allUsers.length,
        finalCount,
        duplicateEmails,
        cleanupResults,
        message: `Cleaned ${cleanupResults.length} duplicate users`,
      },
    });
  } catch (error: any) {
    console.error("❌ Error cleaning users:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
