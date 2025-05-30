import React from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import type { EducationContent } from '../types';

interface EducationModalProps {
  article: EducationContent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  article,
  isOpen,
  onClose
}) => {
  if (!isOpen || !article) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recycling':
        return 'bg-blue-100 text-blue-800';
      case 'composting':
        return 'bg-green-100 text-green-800';
      case 'reduction':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'recycling':
        return 'Daur Ulang';
      case 'composting':
        return 'Kompos';
      case 'reduction':
        return 'Pengurangan';
      default:
        return category;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                <Tag className="h-3 w-3 mr-1" />
                {getCategoryLabel(article.category)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title='Close Button'
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Featured Image */}
            {article.imageUrl && (
              <div className="w-full h-64 md:h-80">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="px-6 py-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                {article.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {article.author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{typeof article.author === 'string' ? article.author : 'Admin'}</span>
                  </div>
                )}
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 whitespace-pre-wrap leading-loose"
                >
                  {article.content}
                </div>
              </div>

              {/* Related Tips Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Tips Tambahan
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {article.category === 'recycling' && (
                    <>
                      <p>• Pastikan sampah dalam kondisi bersih sebelum didaur ulang</p>
                      <p>• Pisahkan berbagai jenis material (plastik, kertas, logam)</p>
                      <p>• Cari tahu lokasi bank sampah terdekat untuk menyetor sampah</p>
                    </>
                  )}
                  {article.category === 'composting' && (
                    <>
                      <p>• Gunakan perbandingan 3:1 antara bahan coklat dan hijau</p>
                      <p>• Aduk kompos secara teratur untuk aerasi yang baik</p>
                      <p>• Jaga kelembaban kompos agar tidak terlalu kering atau basah</p>
                    </>
                  )}
                  {article.category === 'reduction' && (
                    <>
                      <p>• Mulai dari perubahan kecil dalam kebiasaan sehari-hari</p>
                      <p>• Pilih produk dengan kemasan yang dapat didaur ulang</p>
                      <p>• Ajak keluarga dan teman untuk menerapkan gaya hidup ramah lingkungan</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Artikel ini membantu? Bagikan untuk orang lain!
              </div>
              <button
                onClick={onClose}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};