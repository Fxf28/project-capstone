import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  BookOpen,
  Clock,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { EducationContent } from '../types';
import { educationAPI } from '../services/api';

export const EducationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<EducationContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<EducationContent[]>([]);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Pakai API service yang sudah ada
      const articles = await educationAPI.getAll();

      const foundArticle = articles.find(item => item._id === articleId);

      if (!foundArticle) {
        setError('Artikel tidak ditemukan');
        setArticle(null);
        return;
      }

      setArticle(foundArticle);

      // Get related articles (same category, exclude current)
      const related = articles
        .filter(item => item._id !== articleId && item.category === foundArticle.category)
        .slice(0, 3);
      setRelatedArticles(related);

    } catch (err: any) {
      setError(err.message || 'Gagal memuat artikel');
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

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

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link artikel telah disalin ke clipboard!');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link artikel telah disalin ke clipboard!');
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Artikel tidak ditemukan'}
          </h2>
          <p className="text-gray-600 mb-4">
            Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </p>
          <Link
            to="/education"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Edukasi</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/education')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Edukasi</span>
            </button>

            <button
              onClick={shareArticle}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
              <Tag className="h-4 w-4 mr-1" />
              {getCategoryLabel(article.category)}
            </span>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
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

              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{estimateReadingTime(article.content)} menit baca</span>
              </div>

              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{typeof article.author === 'string' ? article.author : 'Admin'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm"
            >
              {article.content}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            💡 Tips Tambahan
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            {article.category === 'recycling' && (
              <>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Pisahkan berbagai jenis material (plastik, kertas, logam)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Cari tahu lokasi bank sampah terdekat untuk menyetor sampah</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Pelajari kode daur ulang pada kemasan produk</span>
                </div>
              </>
            )}
            {article.category === 'composting' && (
              <>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Gunakan perbandingan 3:1 antara bahan coklat dan hijau</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Aduk kompos secara teratur untuk aerasi yang baik</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Jaga kelembaban kompos agar tidak terlalu kering atau basah</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Hindari memasukkan daging atau produk susu ke kompos</span>
                </div>
              </>
            )}
            {article.category === 'reduction' && (
              <>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Mulai dari perubahan kecil dalam kebiasaan sehari-hari</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Pilih produk dengan kemasan yang dapat didaur ulang</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Ajak keluarga dan teman untuk menerapkan gaya hidup ramah lingkungan</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Gunakan produk yang tahan lama dan dapat diperbaiki</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <Link
                  key={relatedArticle._id}
                  to={`/education/${relatedArticle._id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {relatedArticle.imageUrl && (
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getCategoryColor(relatedArticle.category)}`}>
                      {getCategoryLabel(relatedArticle.category)}
                    </span>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedArticle.content.substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Artikel ini membantu?
          </h3>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
              <span>Suka</span>
            </button>
            <button
              onClick={shareArticle}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Bagikan</span>
            </button>
            <Link
              to="/education"
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>Baca Lainnya</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};