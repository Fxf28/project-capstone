import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import Classification from "@/models/Classification";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];
  const { ids } = req.body;

  // Validation
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid or empty IDs array" });
  }

  // Validate all IDs are valid ObjectIds
  const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length !== ids.length) {
    return res.status(400).json({ success: false, error: "Some IDs are invalid" });
  }

  try {
    console.log("🗑️ Bulk deleting classifications:", ids.length);

    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Delete classifications (only user's own classifications)
    const result = await Classification.deleteMany({
      _id: { $in: validIds },
      userId: user._id,
    });

    console.log(`✅ Bulk deleted ${result.deletedCount} classifications`);

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} classifications deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("❌ Error bulk deleting classifications:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to bulk delete classifications",
    });
  }
}
