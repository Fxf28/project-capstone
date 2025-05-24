import { useState, useEffect, useCallback } from 'react';
import { wasteBankAPI } from '../services/api';
import type { WasteBank } from '../types';

export const useWasteBanks = () => {
  const [wasteBanks, setWasteBanks] = useState<WasteBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWasteBanks = useCallback(async (params?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
    wasteType?: string;
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏦 Fetching waste banks with params:', params);
      const data = await wasteBankAPI.getAll(params);
      console.log('🏦 Waste banks fetched:', data);
      
      if (data && data.wasteBanks) {
        setWasteBanks(data.wasteBanks);
        console.log(`✅ Successfully loaded ${data.wasteBanks.length} waste banks`);
      } else {
        console.warn('⚠️ No waste banks data in response:', data);
        setWasteBanks([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching waste banks:', error);
      setError(error.message || 'Failed to fetch waste banks');
      
      // Don't clear existing data on error unless it's the first load
      if (wasteBanks.length === 0) {
        setWasteBanks([]);
      }
    } finally {
      setLoading(false);
    }
  }, [wasteBanks.length]);

  // Initial fetch
  useEffect(() => {
    console.log('🏦 useWasteBanks: Initial fetch triggered');
    fetchWasteBanks();
  }, []); // Empty dependency array for initial fetch only

  const addWasteBank = async (newWasteBank: Omit<WasteBank, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🏦 Adding new waste bank:', newWasteBank);
      const created = await wasteBankAPI.create(newWasteBank);
      setWasteBanks(prev => [created, ...prev]);
      console.log('✅ Waste bank added successfully:', created);
      return created;
    } catch (error: any) {
      console.error('❌ Error adding waste bank:', error);
      throw error;
    }
  };

  const updateWasteBank = async (id: string, updates: Partial<WasteBank>) => {
    try {
      console.log('🏦 Updating waste bank:', id, updates);
      const updated = await wasteBankAPI.update(id, updates);
      setWasteBanks(prev => prev.map(item => item._id === id ? updated : item));
      console.log('✅ Waste bank updated successfully:', updated);
      return updated;
    } catch (error: any) {
      console.error('❌ Error updating waste bank:', error);
      throw error;
    }
  };

  const deleteWasteBank = async (id: string) => {
    try {
      console.log('🏦 Deleting waste bank:', id);
      await wasteBankAPI.delete(id);
      setWasteBanks(prev => prev.filter(item => item._id !== id));
      console.log('✅ Waste bank deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting waste bank:', error);
      throw error;
    }
  };

  const refreshWasteBanks = () => {
    fetchWasteBanks();
  };

  return {
    wasteBanks,
    loading,
    error,
    fetchWasteBanks,
    addWasteBank,
    updateWasteBank,
    deleteWasteBank,
    refreshWasteBanks
  };
};