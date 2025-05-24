import { NextApiRequest, NextApiResponse } from 'next';

export function handleCors(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for development
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-requested-with');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates this was a preflight request
  }

  return false; // Continue with normal request
}