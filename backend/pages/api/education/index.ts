import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../src/lib/mongodb';
import User from '../../../src/models/User';
import Education from '../../../src/models/Education';
import { handleCors } from '../../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 ${req.method} /api/education`);

  if (req.method === 'GET') {
    return await handleGetEducation(req, res);
  } else if (req.method === 'POST') {
    return await handleCreateEducation(req, res);
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// Get all education content (public untuk logged-in users)
async function handleGetEducation(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('📚 Fetching education content...');
    await connectToMongoose();

    const { category, search, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    if (category && ['recycling', 'composting', 'reduction'].includes(category as string)) {
      filter.category = category;
    }
    
    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Get education content with pagination
    const educationContent = await Education
      .find(filter)
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Education.countDocuments(filter);

    console.log(`✅ Found ${educationContent.length} education content items`);

    // Consistent response structure
    const response = {
      success: true,
      data: {
        content: educationContent,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      },
      message: `Found ${educationContent.length} education articles`
    };

    return res.status(200).json(response);

  } catch (error: any) {
    console.error('❌ Error fetching education content:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch education content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Create new education content (admin only)
async function handleCreateEducation(req: NextApiRequest, res: NextApiResponse) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];
  const { title, content, category, imageUrl } = req.body;

  // Validation
  if (!title || !content || !category) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title, content, and category are required' 
    });
  }

  if (!['recycling', 'composting', 'reduction'].includes(category)) {
    return res.status(400).json({ success: false, error: 'Invalid category' });
  }

  try {
    console.log('📝 Creating education content...');
    
    // Verify user and check admin status
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
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
    }

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    // Create education content
    const educationContent = new Education({
      title: title.trim(),
      content: content.trim(),
      category,
      imageUrl: imageUrl || null,
      author: user._id
    });

    await educationContent.save();
    
    // Populate author info
    await educationContent.populate('author', 'displayName email');

    console.log('✅ Education content created:', educationContent._id);

    return res.status(201).json({
      success: true,
      data: educationContent,
      message: 'Education content created successfully'
    });

  } catch (error: any) {
    console.error('❌ Error creating education content:', error.message);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create education content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}