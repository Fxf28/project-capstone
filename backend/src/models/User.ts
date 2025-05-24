import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

const UserSchema = new Schema<IUser>({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    default: null
  },
  photoURL: {
    type: String,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

// Check if user is admin based on email
UserSchema.pre('save', function(next) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  if (adminEmails.includes(this.email)) {
    this.isAdmin = true;
    console.log(`👑 Admin user detected: ${this.email}`);
  }
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);