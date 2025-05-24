import mongoose, { Document, Schema } from 'mongoose';

export interface IWasteBank extends Document {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  operatingHours?: string;
  acceptedWastes: string[];
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WasteBankSchema = new Schema<IWasteBank>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  operatingHours: {
    type: String,
    trim: true,
    default: null
  },
  acceptedWastes: {
    type: [String],
    required: true,
    validate: {
      validator: function(wastes: string[]) {
        return wastes.length > 0;
      },
      message: 'At least one accepted waste type is required'
    }
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
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
WasteBankSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for geospatial queries
WasteBankSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.models.WasteBank || mongoose.model<IWasteBank>('WasteBank', WasteBankSchema);