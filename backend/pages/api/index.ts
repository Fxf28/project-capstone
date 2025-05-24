import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  res.status(200).json({
    name: 'EcoSort Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      test: 'GET /api/test - Basic connection test',
      health: 'GET /api/health - Health check',
      auth: {
        verify: 'POST /api/auth/verify - Verify Firebase token',
        user: 'GET /api/auth/user - Get user profile'
      },
      classify: {
        save: 'POST /api/classify/save - Save classification result',
        history: 'GET /api/classify/history - Get classification history'
      },
      education: {
        list: 'GET /api/education - Get education content',
        create: 'POST /api/education - Create content (admin)',
        update: 'PUT /api/education/[id] - Update content (admin)',
        delete: 'DELETE /api/education/[id] - Delete content (admin)'
      },
      admin: {
        users: 'GET /api/admin/users - Get all users (admin)',
        stats: 'GET /api/admin/stats - Get statistics (admin)'
      },
      chatbot: {
        message: 'POST /api/chatbot/message - Send message to bot'
      }
    }
  });
}