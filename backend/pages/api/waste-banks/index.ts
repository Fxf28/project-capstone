import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";
import WasteBank from "@/models/WasteBank";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers - harus di awal
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    console.log(`🏦 Waste Banks API - ${req.method} request`);

    if (req.method === "GET") {
      return await handleGetWasteBanks(req, res);
    } else if (req.method === "POST") {
      return await handleCreateWasteBank(req, res);
    } else {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("❌ Waste Banks API error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Get all waste banks (untuk semua user yang login)
async function handleGetWasteBanks(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("📍 Fetching waste banks...");
    await connectToMongoose();

    const { latitude, longitude, radius = 50, search, wasteType, page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { isActive: true };

    if (search && typeof search === "string") {
      filter.$or = [{ name: { $regex: search, $options: "i" } }, { address: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    if (wasteType && typeof wasteType === "string") {
      filter.acceptedWastes = { $in: [wasteType] };
    }

    // Get waste banks
    const wasteBanks = await WasteBank.find(filter).populate("author", "displayName email").sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean();

    // Calculate distances if coordinates provided
    let wasteBanksWithDistance = wasteBanks;
    if (latitude && longitude) {
      const userLat = parseFloat(latitude as string);
      const userLng = parseFloat(longitude as string);

      wasteBanksWithDistance = wasteBanks
        .map((bank) => ({
          ...bank,
          distance: calculateDistance(userLat, userLng, bank.latitude, bank.longitude),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Get total count
    const total = await WasteBank.countDocuments(filter);

    console.log(`✅ Found ${wasteBanks.length} waste banks`);

    return res.status(200).json({
      success: true,
      data: {
        wasteBanks: wasteBanksWithDistance,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching waste banks:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch waste banks",
    });
  }
}

// Create new waste bank (admin only)
async function handleCreateWasteBank(req: NextApiRequest, res: NextApiResponse) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authorization required" });
  }

  const token = authHeader.split("Bearer ")[1];
  const { name, address, latitude, longitude, phone, operatingHours, acceptedWastes, description, imageUrl, isActive = true } = req.body;

  // Validation
  if (!name || !address || latitude === undefined || longitude === undefined || !acceptedWastes) {
    return res.status(400).json({
      success: false,
      error: "Name, address, coordinates, and accepted wastes are required",
    });
  }

  if (!Array.isArray(acceptedWastes) || acceptedWastes.length === 0) {
    return res.status(400).json({
      success: false,
      error: "At least one accepted waste type is required",
    });
  }

  try {
    console.log("🏦 Creating waste bank...");

    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    // Create waste bank
    const wasteBank = new WasteBank({
      name: name.trim(),
      address: address.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      phone: phone?.trim() || null,
      operatingHours: operatingHours?.trim() || null,
      acceptedWastes: acceptedWastes.map((waste: string) => waste.trim()),
      description: description?.trim() || null,
      imageUrl: imageUrl || null,
      isActive: Boolean(isActive),
      author: user._id,
    });

    await wasteBank.save();

    // Populate author info
    await wasteBank.populate("author", "displayName email");

    console.log("✅ Waste bank created:", wasteBank._id);

    return res.status(201).json({
      success: true,
      data: wasteBank,
      message: "Waste bank created successfully",
    });
  } catch (error: any) {
    console.error("❌ Error creating waste bank:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create waste bank",
    });
  }
}

// Helper function to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
