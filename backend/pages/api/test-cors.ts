import { NextApiRequest, NextApiResponse } from 'next';
import { handleCors } from '../../src/utils/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS first
  if (handleCors(req, res)) {
    return; // Was a preflight request, already handled
  }

  console.log(`📥 CORS Test - ${req.method} from ${req.headers.origin}`);

  // Test all HTTP methods
  const response = {
    success: true,
    message: 'CORS test successful!',
    method: req.method,
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type']
    },
    body: req.body || null
  };

  if (req.method === 'GET') {
    res.status(200).json(response);
  } else if (req.method === 'POST') {
    res.status(201).json({ ...response, message: 'POST request successful!' });
  } else if (req.method === 'PUT') {
    res.status(200).json({ ...response, message: 'PUT request successful!' });
  } else if (req.method === 'DELETE') {
    res.status(200).json({ ...response, message: 'DELETE request successful!' });
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}