import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const healthData = {
    status: 'healthy',
    service: 'EcoSort Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    checks: {
      api: 'OK',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      },
      config: {
        mongodb: process.env.MONGODB_URI ? '✅ Connected' : '❌ Not configured',
        firebase: process.env.FIREBASE_PROJECT_ID ? '✅ Configured' : '❌ Not configured',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configured' : '❌ Not configured'
      }
    }
  };

  res.status(200).json(healthData);
}