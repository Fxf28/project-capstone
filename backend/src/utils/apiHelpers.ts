import { NextApiResponse } from 'next';

export function sendSuccess(res: NextApiResponse, data: any, message?: string) {
  return res.status(200).json({
    success: true,
    data,
    message
  });
}

export function sendError(res: NextApiResponse, statusCode: number, message: string) {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
}

export function sendCreated(res: NextApiResponse, data: any, message?: string) {
  return res.status(201).json({
    success: true,
    data,
    message
  });
}