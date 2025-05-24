import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test response
  res.status(200).json({
    success: true,
    message: 'Backend connection successful! 🎉',
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: {
      origin: req.headers.origin || 'no-origin',
      userAgent: req.headers['user-agent'] || 'unknown',
      contentType: req.headers['content-type'] || 'none'
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3001',
      hasMongoUri: !!process.env.MONGODB_URI,
      hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
      hasCloudinaryConfig: !!process.env.CLOUDINARY_CLOUD_NAME
    }
  });
}