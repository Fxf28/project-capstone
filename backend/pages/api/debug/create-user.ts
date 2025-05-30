import { NextApiRequest, NextApiResponse } from "next";
import { verifyFirebaseToken } from "@/lib/firebase-admin";
import { connectToMongoose } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  const allowedOrigins = ["http://localhost:5173", "https://project-capstone-gamma.vercel.app/"];
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
    return res.status(400).json({ success: false, error: "Firebase token required" });
  }

  try {
    console.log("🔧 Debug: Creating user manually...");

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(token);
    console.log("✅ Token verified for:", decodedToken.email);

    // Connect to database
    await connectToMongoose();

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (user) {
      console.log("👤 User already exists in database");
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: {
          uid: user.firebaseUid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
      });
    }

    // Create new user
    user = new User({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
      photoURL: decodedToken.picture || null,
    });

    await user.save();
    console.log("✅ User created successfully:", user.email);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        uid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Error creating user:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
