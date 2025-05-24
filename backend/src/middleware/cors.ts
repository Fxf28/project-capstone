import { NextApiRequest, NextApiResponse } from 'next';
import { setCorsHeaders, handleOptionsRequest } from '../utils/corsHeaders';

export async function applyCors(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest(res);
  }
}