import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function withErrorHandler(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', error);

      let statusCode = 500;
      let message = 'Internal server error';

      if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
      } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
      } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
      } else if (error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry';
      }

      return res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  };
}