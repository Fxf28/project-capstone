import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoose } from "@/lib/mongodb";
import Education from "@/models/Education";
import { handleCors } from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return;
  }

  console.log(`📥 ${req.method} /api/test-education`);

  try {
    await connectToMongoose();

    // Get education content count
    const count = await Education.countDocuments();

    // Get sample education content
    const sample = await Education.find().limit(3).lean();

    const response = {
      success: true,
      data: {
        count,
        sample,
        structure: sample.length > 0 ? Object.keys(sample[0]) : [],
      },
      message: `Found ${count} education articles in database`,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("❌ Test education error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: "Failed to test education endpoint",
    });
  }
}
