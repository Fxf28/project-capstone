import { useState } from 'react';
import { chatbotAPI } from '../services/api';
import type { ChatMessage } from '../types';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Halo! Saya EcoBot. Saya siap membantu Anda dengan pertanyaan tentang pengelolaan sampah dan daur ulang. Ada yang bisa saya bantu?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const botResponses = await chatbotAPI.sendMessage(text);
      setMessages(prev => [...prev, ...botResponses]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Halo! Saya EcoBot. Saya siap membantu Anda dengan pertanyaan tentang pengelolaan sampah dan daur ulang. Ada yang bisa saya bantu?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat
  };
};