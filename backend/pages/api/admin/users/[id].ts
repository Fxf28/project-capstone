import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../../../src/lib/firebase-admin';
import { connectToMongoose } from '../../../../src/lib/mongodb';
import User from '../../../../src/models/User';
import Classification from '../../../../src/models/Classification';
import { handleCors } from '../../../../src/utils/cors';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid user ID' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid user ID format' });
  }

  console.log(`📥 ${req.method} /api/admin/users/${id}`);

  if (req.method === 'DELETE') {
    return handleDeleteUser(req, res, id);
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    console.log('🗑️ Admin deleting user:', id);
    
    // Verify admin user
    const decodedToken = await verifyFirebaseToken(token);
    await connectToMongoose();
    
    const adminUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    // Check if user exists
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (targetUser._id.toString() === adminUser._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }

    // Prevent deleting other admins
    if (targetUser.isAdmin) {
      return res.status(400).json({ success: false, error: 'Cannot delete admin accounts' });
    }

    console.log('🗑️ Deleting user classifications...');
    // Delete user's classifications
    await Classification.deleteMany({ userId: targetUser._id });

    console.log('🗑️ Deleting user account...');
    // Delete user
    await User.findByIdAndDelete(id);

    console.log('✅ User deleted successfully:', targetUser.email);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Error deleting user:', error.message);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}