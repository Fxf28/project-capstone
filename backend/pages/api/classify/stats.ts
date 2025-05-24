import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../src/lib/mongodb';
import User from '../../../src/models/User';
import Classification from '../../../src/models/Classification';
import { handleCors } from '../../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return;
  }

  console.log(`📥 ${req.method} /api/classify/stats`);

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    console.log('📊 Fetching user classification stats...');
    
    // Verify user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const userId = user._id;

    // Get total classifications
    const totalClassifications = await Classification.countDocuments({ userId });

    // Get classifications by result type
    const classificationsByType = await Classification.aggregate([
      { $match: { userId } },
      { $group: { _id: '$classificationResult', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get classifications by method
    const classificationsByMethod = await Classification.aggregate([
      { $match: { userId } },
      { $group: { _id: '$method', count: { $sum: 1 } } }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Classification.aggregate([
      { 
        $match: { 
          userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Calculate average confidence
    const avgConfidenceResult = await Classification.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
    ]);

    const avgConfidence = avgConfidenceResult[0]?.avgConfidence || 0;

    console.log(`✅ Stats compiled for user: ${totalClassifications} total classifications`);

    return res.status(200).json({
      success: true,
      data: {
        totalClassifications,
        classificationsByType,
        classificationsByMethod,
        recentActivity,
        avgConfidence
      }
    });

  } catch (error: any) {
    console.error('❌ Error fetching user stats:', error.message);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user statistics' 
    });
  }
}