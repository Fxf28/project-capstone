import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoose } from '../../src/lib/mongodb';
import User from '../../src/models/User';
import Classification from '../../src/models/Classification';
import Education from '../../src/models/Education';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing database connection...');
    
    // Test MongoDB connection
    await connectToMongoose();
    console.log('✅ MongoDB connected');

    // Test collections
    const collections = await Promise.all([
      User.countDocuments(),
      Classification.countDocuments(),
      Education.countDocuments()
    ]);

    console.log('✅ Collections tested');

    // Test environment variables
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      firebase: !!process.env.FIREBASE_PROJECT_ID,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      adminEmails: !!process.env.ADMIN_EMAILS
    };

    return res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      collections: {
        users: collections[0],
        classifications: collections[1],
        education: collections[2]
      },
      environment: envCheck,
      database: {
        readyState: 1, // Connected
        name: 'ecosort'
      }
    });

  } catch (error: any) {
    console.error('❌ Database test failed:', error.message);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: {
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Missing',
        connectionState: 'Failed'
      }
    });
  }
}