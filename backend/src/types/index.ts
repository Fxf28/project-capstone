export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
  };
}

export interface ClassificationData {
  imageUrl: string;
  classificationResult: string;
  confidence: number;
  method: 'upload' | 'camera';
}

export interface EducationData {
  title: string;
  content: string;
  category: 'recycling' | 'composting' | 'reduction';
  imageUrl?: string;
}

export interface AdminStatsData {
  totalUsers: number;
  totalClassifications: number;
  totalEducationContent: number;
  recentActivity: {
    date: string;
    classifications: number;
    newUsers: number;
  }[];
}