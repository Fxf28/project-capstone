import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import Classification from "@/models/Classification";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Invalid classification ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid classification ID format" });
  }

  try {
    if (req.method === "GET") {
      return await handleGetById(req, res, id);
    } else if (req.method === "DELETE") {
      return await handleDelete(req, res, id);
    } else {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("❌ Classification [id] API error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function handleGetById(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const classification = await Classification.findOne({
      _id: id,
      userId: user._id,
    });

    if (!classification) {
      return res.status(404).json({ success: false, error: "Classification not found" });
    }

    return res.status(200).json({ success: true, data: classification });
  } catch (error: any) {
    console.error("❌ Error fetching classification:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({ success: false, error: "Failed to fetch classification" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    console.log("🗑️ Deleting classification:", id);

    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Find and delete classification (only user's own classifications)
    const classification = await Classification.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!classification) {
      return res.status(404).json({ success: false, error: "Classification not found or unauthorized" });
    }

    console.log("✅ Classification deleted successfully:", id);

    return res.status(200).json({
      success: true,
      message: "Classification deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting classification:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to delete classification",
    });
  }
}
