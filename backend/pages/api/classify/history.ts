import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../src/lib/mongodb';
import User from '../../../src/models/User';
import Classification from '../../../src/models/Classification';
import { handleCors } from '../../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 ${req.method} /api/classify/history`);

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
    console.log('📊 Fetching classification history...');
    
    // Verify user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      // Auto-create user if not exists
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
      });
      await user.save();
      console.log('👤 Created new user for history');
    }

    const { page = 1, limit = 20, method, result } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { userId: user._id };
    
    if (method && ['upload', 'camera'].includes(method as string)) {
      filter.method = method;
    }
    
    if (result && typeof result === 'string' && result !== 'all') {
      filter.classificationResult = result;
    }

    console.log('🔍 Filter:', filter);

    // Get classifications with pagination
    const classifications = await Classification
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Classification.countDocuments(filter);

    console.log(`✅ Found ${classifications.length} classification records for user (total: ${total})`);

    return res.status(200).json({
      success: true,
      data: {
        classifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      message: `Found ${classifications.length} classification records`
    });

  } catch (error: any) {
    console.error('❌ Error fetching classification history:', error.message);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch classification history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}