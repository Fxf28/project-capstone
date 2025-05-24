import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../src/lib/mongodb';
import User from '../../../src/models/User';
import { handleCors } from '../../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 ${req.method} /api/auth/user`);

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing authorization header');
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization header'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    console.log('🔐 Getting user profile...');
    
    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(token);
    console.log('✅ Token verified for user:', decodedToken.email);
    
    // Connect to database
    await connectToMongoose();
    
    // Find user by Firebase UID first (more reliable)
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      console.log('👤 User not found by UID, checking by email...');
      
      // Check if user exists by email (might have different UID)
      const existingUserByEmail = await User.findOne({ email: decodedToken.email });
      
      if (existingUserByEmail) {
        console.log('📧 User found by email, updating UID...');
        
        // Update the existing user's Firebase UID
        existingUserByEmail.firebaseUid = decodedToken.uid;
        existingUserByEmail.displayName = decodedToken.name || existingUserByEmail.displayName;
        existingUserByEmail.photoURL = decodedToken.picture || existingUserByEmail.photoURL;
        existingUserByEmail.lastLoginAt = new Date();
        
        await existingUserByEmail.save();
        user = existingUserByEmail;
        
        console.log('✅ User UID updated successfully');
      } else {
        console.log('👤 Creating completely new user...');
        
        // Create new user with proper error handling
        try {
          user = new User({
            firebaseUid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
            photoURL: decodedToken.picture || null,
          });
          
          await user.save();
          console.log('✅ New user created successfully');
        } catch (saveError: any) {
          // Handle duplicate key error specifically
          if (saveError.code === 11000) {
            console.log('⚠️ Duplicate key error during creation, trying to find existing user...');
            
            // Try to find user again (race condition)
            user = await User.findOne({ 
              $or: [
                { firebaseUid: decodedToken.uid },
                { email: decodedToken.email }
              ]
            });
            
            if (user) {
              // Update existing user
              user.firebaseUid = decodedToken.uid;
              user.lastLoginAt = new Date();
              await user.save();
              console.log('✅ Found and updated existing user after duplicate error');
            } else {
              // Still can't find user, this is unexpected
              throw new Error('User creation failed due to duplicate key but user not found');
            }
          } else {
            throw saveError;
          }
        }
      }
    } else {
      console.log('✅ Existing user found by UID:', user.email);
      
      // Update last login time
      user.lastLoginAt = new Date();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        uid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error: any) {
    console.error('❌ Error getting user profile:', error.message);
    console.error('Full error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error getting user profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}