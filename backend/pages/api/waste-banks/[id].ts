import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import WasteBank from "@/models/WasteBank";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Invalid waste bank ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid waste bank ID format" });
  }

  try {
    if (req.method === "GET") {
      return await handleGetById(req, res, id);
    } else if (req.method === "PUT") {
      return await handleUpdate(req, res, id);
    } else if (req.method === "DELETE") {
      return await handleDelete(req, res, id);
    } else {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("❌ Waste Bank [id] API error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function handleGetById(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await connectToMongoose();

    const wasteBank = await WasteBank.findById(id).populate("author", "displayName email").lean();

    if (!wasteBank) {
      return res.status(404).json({ success: false, error: "Waste bank not found" });
    }

    return res.status(200).json({ success: true, data: wasteBank });
  } catch (error: any) {
    console.error("❌ Error fetching waste bank:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch waste bank" });
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const { name, address, latitude, longitude, phone, operatingHours, acceptedWastes, description, imageUrl, isActive } = req.body;

    const updateData: any = { updatedAt: new Date() };

    if (name) updateData.name = name.trim();
    if (address) updateData.address = address.trim();
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude);
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (operatingHours !== undefined) updateData.operatingHours = operatingHours?.trim() || null;
    if (acceptedWastes) updateData.acceptedWastes = acceptedWastes.map((waste: string) => waste.trim());
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const wasteBank = await WasteBank.findByIdAndUpdate(id, updateData, { new: true }).populate("author", "displayName email");

    if (!wasteBank) {
      return res.status(404).json({ success: false, error: "Waste bank not found" });
    }

    console.log("✅ Waste bank updated:", wasteBank._id);

    return res.status(200).json({
      success: true,
      data: wasteBank,
      message: "Waste bank updated successfully",
    });
  } catch (error: any) {
    console.error("❌ Error updating waste bank:", error.message);
    return res.status(500).json({ success: false, error: "Failed to update waste bank" });
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
    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const wasteBank = await WasteBank.findByIdAndDelete(id);

    if (!wasteBank) {
      return res.status(404).json({ success: false, error: "Waste bank not found" });
    }

    console.log("✅ Waste bank deleted:", id);

    return res.status(200).json({
      success: true,
      message: "Waste bank deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting waste bank:", error.message);
    return res.status(500).json({ success: false, error: "Failed to delete waste bank" });
  }
}
