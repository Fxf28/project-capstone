import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../lib/firebase-admin';
import { connectToMongoose } from '../lib/mongodb';
import User, { IUser } from '../models/User';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
    dbUser?: IUser;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing or invalid authorization header'
        });
      }

      const token = authHeader.split('Bearer ')[1];
      
      // Verify Firebase token
      const decodedToken = await verifyFirebaseToken(token);
      console.log('🔐 Auth middleware - token verified for:', decodedToken.email);
      
      // Connect to database
      await connectToMongoose();
      
      // Find or create user in database
      let dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!dbUser) {
        console.log('👤 Auth middleware - creating new user for:', decodedToken.email);
        
        // Auto-create user
        dbUser = new User({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name || null,
          photoURL: decodedToken.picture || null,
        });
        await dbUser.save();
        console.log('✅ Auth middleware - user created successfully');
      } else {
        // Update last login
        dbUser.lastLoginAt = new Date();
        await dbUser.save();
      }

      // Attach user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email!,
        isAdmin: dbUser.isAdmin,
        dbUser: dbUser
      };

      return handler(req, res);
    } catch (error) {
      console.error('❌ Authentication error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  };
}

export function withAdminAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    return handler(req, res);
  });
}