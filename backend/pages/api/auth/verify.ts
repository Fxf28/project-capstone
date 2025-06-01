import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";

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

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "Token is required" });
  }

  try {
    console.log("🔐 Verifying Firebase token...");

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(token);
    console.log("✅ Token verified for user:", decodedToken.email);

    // Connect to database
    await connectToMongoose();

    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      console.log("👤 Creating new user:", decodedToken.email);
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
      });
      await user.save();
      console.log("✅ User created successfully");
    } else {
      console.log("👤 Existing user found, updating last login");
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        uid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      message: "Token verified successfully",
    });
  } catch (error: any) {
    console.error("❌ Token verification failed:", error.message);

    if (error.message === "Invalid token") {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error during token verification",
    });
  }
}
