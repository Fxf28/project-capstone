export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface ClassificationResult {
  _id?: string;
  userId?: string;
  imageUrl: string;
  classificationResult: string;
  confidence: number;
  method: 'upload' | 'camera';
  createdAt?: string;
}

export interface EducationContent {
  _id?: string;
  title: string;
  content: string;
  category: 'recycling' | 'composting' | 'reduction';
  imageUrl?: string;
  author?: string | {
    _id: string;
    displayName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WasteBank {
  _id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  operatingHours?: string;
  acceptedWastes: string[];
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  author?: string;
  distance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalClassifications: number;
  totalEducationContent: number;
  recentActivity: {
    date: string;
    classifications: number;
    newUsers: number;
  }[];
  classificationStats?: {
    _id: string;
    count: number;
  }[];
  topUsers?: {
    count: number;
    user: {
      displayName: string;
      email: string;
    };
  }[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  content: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface EducationApiResponse extends ApiResponse<PaginatedResponse<EducationContent>> {}

export interface ClassificationApiResponse extends ApiResponse<PaginatedResponse<ClassificationResult>> {}

export interface UserApiResponse extends ApiResponse<User> {}

export interface AdminStatsApiResponse extends ApiResponse<AdminStats> {}