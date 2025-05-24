import mongoose, { Document, Schema } from 'mongoose';

export interface IClassification extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  classificationResult: string;
  confidence: number;
  method: 'upload' | 'camera';
  createdAt: Date;
}

const ClassificationSchema = new Schema<IClassification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  classificationResult: {
    type: String,
    required: true,
    enum: [
      'Cardboard',
      'Food Organics',
      'Glass',
      'Metal',
      'Miscellaneous Trash',
      'Paper',
      'Plastic',
      'Textile Trash',
      'Vegetation'
    ]
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  method: {
    type: String,
    required: true,
    enum: ['upload', 'camera']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.models.Classification || mongoose.model<IClassification>('Classification', ClassificationSchema);