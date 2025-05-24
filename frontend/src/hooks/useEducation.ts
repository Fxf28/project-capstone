import { useState, useEffect } from 'react';
import { educationAPI } from '../services/api';
import type { EducationContent } from '../types';

export const useEducation = () => {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Fetching education content...');
      const contentArray = await educationAPI.getAll();
      
      console.log('📚 Received content:', contentArray);
      
      // Ensure we always have an array
      if (Array.isArray(contentArray)) {
        setContent(contentArray);
      } else {
        console.warn('⚠️ educationAPI.getAll() did not return an array:', contentArray);
        setContent([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching education content:', error);
      setError(error.message || 'Failed to fetch education content');
      setContent([]); // Ensure content is still an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const addContent = async (newContent: Omit<EducationContent, '_id' | 'createdAt' | 'updatedAt'>): Promise<EducationContent> => {
    try {
      const created = await educationAPI.create(newContent);
      setContent(prev => [created, ...prev]);
      return created;
    } catch (error: any) {
      console.error('Error adding content:', error);
      throw error;
    }
  };

  const updateContent = async (id: string, updates: Partial<EducationContent>): Promise<EducationContent> => {
    try {
      const updated = await educationAPI.update(id, updates);
      setContent(prev => prev.map(item => 
        item._id === id ? updated : item
      ));
      return updated;
    } catch (error: any) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const deleteContent = async (id: string): Promise<void> => {
    try {
      await educationAPI.delete(id);
      setContent(prev => prev.filter(item => item._id !== id));
    } catch (error: any) {
      console.error('Error deleting content:', error);
      throw error;
    }
  };

  return {
    content,
    loading,
    error,
    fetchContent,
    addContent,
    updateContent,
    deleteContent
  };
};