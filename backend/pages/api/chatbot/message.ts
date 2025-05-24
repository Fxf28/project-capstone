import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { applyCors } from '../../../src/middleware/cors';
import { withErrorHandler } from '../../../src/middleware/errorHandler';
import { sendSuccess, sendError } from '../../../src/utils/apiHelpers';

const RASA_API_URL = process.env.RASA_API_URL || 'http://localhost:5005';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { message, sender = 'anonymous' } = req.body;

  if (!message || typeof message !== 'string') {
    return sendError(res, 400, 'Message is required');
  }

  try {
    // Send message to Rasa
    const rasaResponse = await axios.post(
      `${RASA_API_URL}/webhooks/rest/webhook`,
      {
        sender: sender,
        message: message.trim()
      },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Transform Rasa response to our format
    const botMessages = rasaResponse.data.map((msg: any, index: number) => ({
      id: `${Date.now()}_${index}`,
      text: msg.text || msg.message || 'Maaf, saya tidak mengerti.',
      sender: 'bot',
      timestamp: new Date()
    }));

    // If no response from Rasa, send default message
    if (botMessages.length === 0) {
      botMessages.push({
        id: Date.now().toString(),
        text: 'Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date()
      });
    }

    return sendSuccess(res, botMessages);

  } catch (error) {
    console.error('Rasa API error:', error);

    // Fallback responses for common topics
    const fallbackResponses = getFallbackResponse(message);

    return sendSuccess(res, [{
      id: Date.now().toString(),
      text: fallbackResponses,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('sampah') || lowerMessage.includes('trash') || lowerMessage.includes('waste')) {
    return 'Untuk pengelolaan sampah yang baik, pisahkan sampah organik dan anorganik. Sampah organik bisa dijadikan kompos, sedangkan sampah anorganik seperti plastik, kertas, dan logam bisa didaur ulang.';
  }

  if (lowerMessage.includes('daur ulang') || lowerMessage.includes('recycle')) {
    return 'Daur ulang sangat penting untuk lingkungan! Anda bisa mendaur ulang plastik, kertas, logam, dan kaca. Pastikan sampah dalam kondisi bersih sebelum didaur ulang.';
  }

  if (lowerMessage.includes('kompos') || lowerMessage.includes('organik')) {
    return 'Sampah organik seperti sisa makanan, daun, dan sayuran bisa dijadikan kompos. Caranya: campurkan sampah organik dengan tanah, aduk secara berkala, dan tunggu 2-3 bulan hingga menjadi pupuk kompos.';
  }

  if (lowerMessage.includes('plastik')) {
    return 'Plastik membutuhkan waktu ratusan tahun untuk terurai. Kurangi penggunaan plastik sekali pakai, gunakan kantong belanja yang bisa dipakai berulang, dan pastikan plastik bekas didaur ulang.';
  }

  if (lowerMessage.includes('bank sampah')) {
    return 'Bank sampah adalah tempat menabung sampah yang memiliki nilai ekonomis. Anda bisa menyetorkan sampah anorganik yang sudah dipilah dan mendapatkan uang atau poin. Cari bank sampah terdekat di aplikasi EcoSort!';
  }

  // Default response
  return 'Halo! Saya EcoBot, asisten untuk pengelolaan sampah. Saya bisa membantu Anda dengan informasi tentang: cara memilah sampah, daur ulang, membuat kompos, bank sampah, dan tips mengurangi sampah. Ada yang bisa saya bantu?';
}

export default withErrorHandler(handler);