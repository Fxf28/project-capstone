import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  title: string;
  content: string;
  category: 'recycling' | 'composting' | 'reduction';
  imageUrl?: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['recycling', 'composting', 'reduction'],
    index: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
EducationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);