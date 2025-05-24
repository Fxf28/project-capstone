import React, { useState, useEffect } from 'react';
import { Clock, Camera, Upload, Filter, Download, Trash2, Eye, BarChart3, AlertCircle, X } from 'lucide-react';
import { classificationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ClassificationCard } from '../components/ClassificationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ClassificationResult } from '../types';
import { toast } from 'react-hot-toast';

// Fix: Define proper filter interface
interface FilterState {
  method: 'all' | 'upload' | 'camera';
  result: string;
  page: number;
}

interface PaginationState {
  total: number;
  pages: number;
  currentPage: number;
}

export const History: React.FC = () => {
  const { user } = useAuth();
  const [classifications, setClassifications] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Fix: Proper state typing
  const [filter, setFilter] = useState<FilterState>({
    method: 'all',
    result: 'all',
    page: 1
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  const wasteTypes = [
    'all', 'Cardboard', 'Food Organics', 'Glass', 'Metal',
    'Miscellaneous Trash', 'Paper', 'Plastic', 'Textile Trash', 'Vegetation'
  ];

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, filter]);

  const fetchHistory = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: filter.page.toString(),
        limit: '12'
      });

      if (filter.method !== 'all') {
        params.append('method', filter.method);
      }
      if (filter.result !== 'all') {
        params.append('result', filter.result);
      }

      const response = await classificationAPI.getHistory(params.toString());
      
      if (response.success && response.data) {
        setClassifications(response.data.classifications || []);
        setPagination({
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 0,
          currentPage: response.data.pagination?.page || 1
        });
      } else {
        setClassifications([]);
      }
    } catch (error: any) {
      console.error('Error fetching history:', error);
      setError('Gagal memuat riwayat klasifikasi');
      setClassifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete classification function
  const deleteClassification = async (id: string): Promise<void> => {
    setDeleteLoading(id);
    try {
      // Call delete API (you need to implement this in your API service)
      await classificationAPI.delete(id);
      
      // Remove from local state
      setClassifications(prev => prev.filter(item => item._id !== id));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      toast.success('Klasifikasi berhasil dihapus');
      setShowDeleteConfirm(null);
    } catch (error: any) {
      console.error('Error deleting classification:', error);
      toast.error('Gagal menghapus klasifikasi');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Bulk delete function
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const toggleSelectItem = (id: string): void => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = (): void => {
    if (selectedItems.size === classifications.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(classifications.map(item => item._id!)));
    }
  };

  const bulkDelete = async (): Promise<void> => {
    if (selectedItems.size === 0) return;
    
    setBulkDeleteLoading(true);
    try {
      // Delete all selected items
      await Promise.all(
        Array.from(selectedItems).map(id => classificationAPI.delete(id))
      );
      
      // Remove from local state
      setClassifications(prev => prev.filter(item => !selectedItems.has(item._id!)));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: prev.total - selectedItems.size
      }));
      
      toast.success(`${selectedItems.size} klasifikasi berhasil dihapus`);
      setSelectedItems(new Set());
    } catch (error: any) {
      console.error('Error bulk deleting:', error);
      toast.error('Gagal menghapus beberapa klasifikasi');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  // Fix: Proper type handling for filter changes
  const handleFilterChange = (key: keyof FilterState, value: string | number): void => {
    setFilter(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value as number // Reset page when changing other filters
    }));
  };

  const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Gambar berhasil didownload');
    } catch (error) {
      toast.error('Gagal download gambar');
    }
  };

  const getStats = () => {
    const stats = {
      total: classifications.length,
      byMethod: {} as Record<string, number>,
      byResult: {} as Record<string, number>,
      avgConfidence: 0
    };

    classifications.forEach(item => {
      stats.byMethod[item.method] = (stats.byMethod[item.method] || 0) + 1;
      stats.byResult[item.classificationResult] = (stats.byResult[item.classificationResult] || 0) + 1;
    });

    if (classifications.length > 0) {
      stats.avgConfidence = classifications.reduce((sum, item) => sum + item.confidence, 0) / classifications.length;
    }

    return stats;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Silakan login untuk melihat riwayat klasifikasi</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Riwayat Klasifikasi
          </h1>
          <p className="text-gray-600">
            Lihat semua gambar yang pernah Anda klasifikasi dengan EcoSort
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Klasifikasi</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Via Kamera</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byMethod.camera || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Via Upload</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byMethod.upload || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rata-rata Akurasi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgConfidence.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Bulk Actions */}
            {classifications.length > 0 && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === classifications.length && classifications.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      Pilih Semua ({selectedItems.size}/{classifications.length})
                    </span>
                  </label>
                  
                  {selectedItems.size > 0 && (
                    <button
                      onClick={bulkDelete}
                      disabled={bulkDeleteLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {bulkDeleteLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>Hapus Terpilih ({selectedItems.size})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Metode</label>
                  <select
                    value={filter.method}
                    onChange={(e) => handleFilterChange('method', e.target.value as 'all' | 'upload' | 'camera')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Semua Metode</option>
                    <option value="upload">Upload</option>
                    <option value="camera">Kamera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Jenis Sampah</label>
                  <select
                    value={filter.result}
                    onChange={(e) => handleFilterChange('result', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {wasteTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'Semua Jenis' : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilter({ method: 'all', result: 'all', page: 1 })}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchHistory}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : classifications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classifications.map((item) => (
                <HistoryCard
                  key={item._id}
                  classification={item}
                  onDownload={downloadImage}
                  onDelete={deleteClassification}
                  deleteLoading={deleteLoading === item._id}
                  isSelected={selectedItems.has(item._id!)}
                  onToggleSelect={() => toggleSelectItem(item._id!)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, filter.page - 1))}
                    disabled={filter.page <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handleFilterChange('page', page)}
                        className={`px-3 py-2 border rounded-lg ${
                          filter.page === page
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(pagination.pages, filter.page + 1))}
                    disabled={filter.page >= pagination.pages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Riwayat
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai klasifikasi sampah untuk melihat riwayat di sini
            </p>
            <a
              href="/classify"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Mulai Klasifikasi
            </a>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus klasifikasi ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteClassification(showDeleteConfirm)}
                  disabled={deleteLoading === showDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {deleteLoading === showDeleteConfirm ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated History Card Component with delete functionality
interface HistoryCardProps {
  classification: ClassificationResult;
  onDownload: (imageUrl: string, filename: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  deleteLoading: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ 
  classification, 
  onDownload, 
  onDelete, 
  deleteLoading,
  isSelected,
  onToggleSelect
}) => {
  const [showFullImage, setShowFullImage] = useState<boolean>(false);

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getWasteTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'Cardboard': 'bg-yellow-100 text-yellow-800',
      'Food Organics': 'bg-green-100 text-green-800',
      'Glass': 'bg-blue-100 text-blue-800',
      'Metal': 'bg-gray-100 text-gray-800',
      'Miscellaneous Trash': 'bg-red-100 text-red-800',
      'Paper': 'bg-orange-100 text-orange-800',
      'Plastic': 'bg-purple-100 text-purple-800',
      'Textile Trash': 'bg-pink-100 text-pink-800',
      'Vegetation': 'bg-emerald-100 text-emerald-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>

        {classification.imageUrl && (
          <div className="relative">
            <img 
              src={classification.imageUrl} 
              alt="Classified item"
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setShowFullImage(true)}
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullImage(true);
                }}
                className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                title="Lihat gambar penuh"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(
                    classification.imageUrl, 
                    `ecosort-${classification._id}.jpg`
                  );
                }}
                className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                title="Download gambar"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(classification._id!);
                }}
                disabled={deleteLoading}
                className="bg-red-600 bg-opacity-75 text-white p-1 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                title="Hapus klasifikasi"
              >
                {deleteLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWasteTypeColor(classification.classificationResult)}`}>
              {classification.classificationResult}
            </span>
            <div className="flex items-center space-x-1">
              {classification.method === 'camera' ? (
                <Camera className="h-4 w-4 text-gray-500" />
              ) : (
                <Upload className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(classification.confidence)}`}>
              {classification.confidence.toFixed(1)}% yakin
            </span>
            {classification.createdAt && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{formatDate(classification.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={classification.imageUrl}
              alt="Full size classified item"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <p className="font-semibold">{classification.classificationResult}</p>
              <p className="text-sm">Confidence: {classification.confidence.toFixed(1)}%</p>
              <p className="text-xs">{formatDate(classification.createdAt!)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};