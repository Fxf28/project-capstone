import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../src/lib/mongodb';
import User from '../../../src/models/User';
import Education from '../../../src/models/Education';
import { handleCors } from '../../../src/utils/cors';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid education content ID' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid education content ID format' });
  }

  console.log(`📥 ${req.method} /api/education/${id}`);

  if (req.method === 'PUT') {
    return handleUpdate(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  } else if (req.method === 'GET') {
    return handleGetById(req, res, id);
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// Get education content by ID
async function handleGetById(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await connectToMongoose();

    const educationContent = await Education
      .findById(id)
      .populate('author', 'displayName email')
      .lean();

    if (!educationContent) {
      return res.status(404).json({ success: false, error: 'Education content not found' });
    }

    return res.status(200).json({
      success: true,
      data: educationContent
    });

  } catch (error: any) {
    console.error('Error fetching education content:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch education content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Update education content
async function handleUpdate(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];
  const { title, content, category, imageUrl } = req.body;

  // Validation
  if (title && typeof title !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid title' });
  }

  if (content && typeof content !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid content' });
  }

  if (category && !['recycling', 'composting', 'reduction'].includes(category)) {
    return res.status(400).json({ success: false, error: 'Invalid category' });
  }

  try {
    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const updateData: any = { updatedAt: new Date() };

    if (title) updateData.title = title.trim();
    if (content) updateData.content = content.trim();
    if (category) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

    const educationContent = await Education
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'displayName email');

    if (!educationContent) {
      return res.status(404).json({ success: false, error: 'Education content not found' });
    }

    return res.status(200).json({
      success: true,
      data: educationContent,
      message: 'Education content updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating education content:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update education content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Delete education content
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const educationContent = await Education.findByIdAndDelete(id);

    if (!educationContent) {
      return res.status(404).json({ success: false, error: 'Education content not found' });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Education content deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting education content:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete education content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}