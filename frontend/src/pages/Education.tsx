import React, { useState } from "react";
import { Link } from "react-router-dom"; // Added missing import
import {
  BookOpen,
  Recycle,
  Leaf,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useEducation } from "../hooks/useEducation";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EducationModal } from "../components/EducationModal";
import type { EducationContent } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export const Education: React.FC = () => {
  const { content, loading, error, fetchContent } = useEducation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] =
    useState<EducationContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animate variants
  const hover = {
    whileHover: { scale: 1.2 },
    whileTap: { scale: 0.8 },
  };

  const categories = [
    { value: "all", label: "Semua", icon: BookOpen },
    { value: "recycling", label: "Daur Ulang", icon: Recycle },
    { value: "composting", label: "Kompos", icon: Leaf },
    { value: "reduction", label: "Pengurangan", icon: Trash2 },
  ];

  // Safe filtering - ensure content is array
  const filteredContent = Array.isArray(content)
    ? content.filter((item) => {
        const matchesSearch =
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  const openArticleDetail = (article: EducationContent) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const EducationCard: React.FC<{ item: EducationContent }> = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {item.imageUrl && (
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <button
                onClick={() => openArticleDetail(item)}
                className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium flex items-center space-x-2 text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <Link
                to={`/education/${item._id}`}
                className="bg-primary-600 text-white px-3 py-2 rounded-lg font-medium flex items-center space-x-2 text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>Baca Lengkap</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.category === "recycling"
                ? "bg-blue-100 text-blue-800"
                : item.category === "composting"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {categories.find((cat) => cat.value === item.category)?.label ||
              item.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {item.title}
        </h3>

        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {item.content && item.content.length > 150
            ? `${item.content.substring(0, 150)}...`
            : item.content}
        </p>

        <div className="flex items-center justify-between">
          {item.createdAt && (
            <div className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => openArticleDetail(item)}
              className="text-gray-600 hover:text-primary-600 font-medium text-sm flex items-center space-x-1 transition-colors"
            >
              <span>Preview</span>
              <Eye className="h-4 w-4" />
            </button>
            <Link
              to={`/education/${item._id}`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1 transition-colors"
            >
              <span>Baca Lengkap</span>
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Gagal Memuat Konten Edukasi
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchContent}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat konten edukasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Edukasi Lingkungan
          </h1>
          <p className="text-gray-600">
            Pelajari cara mengelola sampah dengan benar untuk lingkungan yang
            lebih baik
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel edukasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <EducationCard key={item._id || Math.random()} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {content.length === 0
                ? "Belum ada artikel edukasi"
                : "Tidak ada artikel ditemukan"}
            </h3>
            <p className="text-gray-600">
              {content.length === 0
                ? "Artikel edukasi akan segera ditambahkan"
                : "Coba ubah kata kunci pencarian atau kategori filter"}
            </p>
          </div>
        )}

        {/* Educational Tips */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Tips Pengelolaan Sampah</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Reduce</h3>
              <p className="text-sm opacity-90">
                Kurangi penggunaan barang sekali pakai
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <Recycle className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Reuse</h3>
              <p className="text-sm opacity-90">
                Gunakan kembali barang yang masih layak
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <Leaf className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Recycle</h3>
              <p className="text-sm opacity-90">
                Daur ulang sampah menjadi produk baru
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <EducationModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
