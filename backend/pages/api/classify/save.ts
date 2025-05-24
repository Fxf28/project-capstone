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

  console.log(`📥 ${req.method} /api/classify/save`);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing authorization header');
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];
  const { imageUrl, classificationResult, confidence, method } = req.body;

  console.log('📊 Classification data:', { classificationResult, confidence, method, hasImageUrl: !!imageUrl });

  // Validation
  if (!imageUrl || !classificationResult || confidence === undefined || !method) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: imageUrl, classificationResult, confidence, method'
    });
  }

  if (confidence < 0 || confidence > 100) {
    return res.status(400).json({ success: false, error: 'Confidence must be between 0 and 100' });
  }

  const validResults = [
    'Cardboard', 'Food Organics', 'Glass', 'Metal', 
    'Miscellaneous Trash', 'Paper', 'Plastic', 
    'Textile Trash', 'Vegetation'
  ];

  if (!validResults.includes(classificationResult)) {
    return res.status(400).json({ success: false, error: 'Invalid classification result' });
  }

  if (!['upload', 'camera'].includes(method)) {
    return res.status(400).json({ success: false, error: 'Invalid method' });
  }

  try {
    console.log('🔐 Verifying user token...');
    
    // Verify user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      console.log('👤 Creating new user for classification...');
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
      });
      await user.save();
    }

    console.log('💾 Saving classification...');

    // Save classification
    const classification = new Classification({
      userId: user._id,
      imageUrl,
      classificationResult,
      confidence,
      method
    });

    await classification.save();
    console.log('✅ Classification saved:', classification._id);

    return res.status(201).json({
      success: true,
      data: {
        _id: classification._id,
        imageUrl: classification.imageUrl,
        classificationResult: classification.classificationResult,
        confidence: classification.confidence,
        method: classification.method,
        createdAt: classification.createdAt
      },
      message: 'Classification saved successfully'
    });

  } catch (error: any) {
    console.error('❌ Error saving classification:', error.message);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save classification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}