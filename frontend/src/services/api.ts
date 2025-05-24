import axios, { AxiosResponse } from 'axios';
import { auth } from './firebase';
import type {
  ClassificationResult,
  EducationContent,
  AdminStats,
  ChatMessage,
  WasteBank,
  User,
  ApiResponse,
  EducationApiResponse,
  ClassificationApiResponse,
  UserApiResponse,
  AdminStatsApiResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RASA_API_URL = import.meta.env.VITE_RASA_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  verifyToken: async (token: string): Promise<UserApiResponse> => {
    const response: AxiosResponse<UserApiResponse> = await api.post('/api/auth/verify', { token });
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response: AxiosResponse<UserApiResponse> = await api.get('/api/auth/user');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get user profile');
  }
};

// Classification API
export const classificationAPI = {
  saveResult: async (result: ClassificationResult): Promise<ClassificationResult> => {
    const response: AxiosResponse<ApiResponse<ClassificationResult>> = await api.post('/api/classify/save', result);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to save classification');
  },
  delete: async (id: string): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/api/classify/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete classification');
      }
    } catch (error: any) {
      console.error('Error deleting classification:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to delete classification');
    }
  },
  bulkDelete: async (ids: string[]): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post('/api/classify/bulk-delete', { ids });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to bulk delete classifications');
      }
    } catch (error: any) {
      console.error('Error bulk deleting classifications:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to bulk delete classifications');
    }
  },
  getHistory: async (queryParams?: string): Promise<ApiResponse<{
    classifications: ClassificationResult[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> => {
    const url = queryParams ? `/api/classify/history?${queryParams}` : '/api/classify/history';
    const response: AxiosResponse<ApiResponse<{
      classifications: ClassificationResult[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>> = await api.get(url);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/api/classify/stats');
    return response.data;
  }
};

// Education API
export const educationAPI = {
  getAll: async (): Promise<EducationContent[]> => {
    try {
      console.log('🔗 Calling education API...');
      const response: AxiosResponse<EducationApiResponse> = await api.get('/api/education');
      console.log('🔗 Education API response:', response.data);

      if (response.data.success && response.data.data) {
        if (response.data.data.content && Array.isArray(response.data.data.content)) {
          return response.data.data.content;
        }
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn('⚠️ Unexpected education API response structure:', response.data);
      return [];
    } catch (error: any) {
      console.error('❌ Education API error:', error);
      if (error.response?.status === 404) {
        console.log('📝 No education content found, returning empty array');
        return [];
      }
      console.error('Failed to fetch education content:', error.message);
      return [];
    }
  },

  create: async (content: Omit<EducationContent, '_id' | 'createdAt' | 'updatedAt'>): Promise<EducationContent> => {
    const response: AxiosResponse<ApiResponse<EducationContent>> = await api.post('/api/education', content);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create education content');
  },

  update: async (id: string, content: Partial<EducationContent>): Promise<EducationContent> => {
    const response: AxiosResponse<ApiResponse<EducationContent>> = await api.put(`/api/education/${id}`, content);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update education content');
  },

  delete: async (id: string): Promise<void> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/api/education/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete education content');
    }
  }
};

// Admin API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response: AxiosResponse<ApiResponse<{ users: User[] }>> = await api.get('/api/admin/users');
    if (response.data.success && response.data.data) {
      return response.data.data.users || [];
    }
    return [];
  },

  getStats: async (): Promise<AdminStats> => {
    const response: AxiosResponse<AdminStatsApiResponse> = await api.get('/api/admin/stats');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get admin stats');
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/api/admin/users/${userId}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete user');
    }
  }
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: async (message: string): Promise<ChatMessage[]> => {
    try {
      const rasaResponse = await axios.post(`${RASA_API_URL}/webhooks/rest/webhook`, {
        sender: auth.currentUser?.uid || 'anonymous',
        message: message
      });

      return rasaResponse.data.map((msg: any, index: number) => ({
        id: `${Date.now()}_${index}`,
        text: msg.text,
        sender: 'bot' as const,
        timestamp: new Date()
      }));
    } catch (error) {
      const response: AxiosResponse<ApiResponse<ChatMessage[]>> = await api.post('/api/chatbot/message', { message });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    }
  }
};

// Cloudinary upload
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
};

// Waste Bank API
export const wasteBankAPI = {
  getAll: async (params?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
    wasteType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ wasteBanks: WasteBank[]; pagination: any }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `/api/waste-banks${queryParams.toString() ? `?${queryParams}` : ''}`;
      console.log('🔗 Calling waste banks API:', url);

      const response = await api.get(url);
      console.log('🔗 Waste banks API response:', response.data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        console.warn('⚠️ Unexpected waste banks API response:', response.data);
        return { wasteBanks: [], pagination: null };
      }
    } catch (error: any) {
      console.error('❌ Waste banks API error:', error);
      if (error.response?.status === 404) {
        console.log('📍 No waste banks found, returning empty array');
        return { wasteBanks: [], pagination: null };
      }
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch waste banks');
    }
  },

  create: async (wasteBank: Omit<WasteBank, '_id' | 'createdAt' | 'updatedAt'>): Promise<WasteBank> => {
    try {
      console.log('🔗 Creating waste bank:', wasteBank);
      const response = await api.post('/api/waste-banks', wasteBank);
      console.log('🔗 Create waste bank response:', response.data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create waste bank');
      }
    } catch (error: any) {
      console.error('❌ Create waste bank error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to create waste bank');
    }
  },

  update: async (id: string, wasteBank: Partial<WasteBank>): Promise<WasteBank> => {
    try {
      console.log('🔗 Updating waste bank:', id, wasteBank);
      const response = await api.put(`/api/waste-banks/${id}`, wasteBank);
      console.log('🔗 Update waste bank response:', response.data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update waste bank');
      }
    } catch (error: any) {
      console.error('❌ Update waste bank error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to update waste bank');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log('🔗 Deleting waste bank:', id);
      const response = await api.delete(`/api/waste-banks/${id}`);
      console.log('🔗 Delete waste bank response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete waste bank');
      }
    } catch (error: any) {
      console.error('❌ Delete waste bank error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to delete waste bank');
    }
  },

  getById: async (id: string): Promise<WasteBank> => {
    try {
      console.log('🔗 Getting waste bank by ID:', id);
      const response = await api.get(`/api/waste-banks/${id}`);
      console.log('🔗 Get waste bank response:', response.data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Waste bank not found');
      }
    } catch (error: any) {
      console.error('❌ Get waste bank error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch waste bank');
    }
  }
};