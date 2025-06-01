import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  BookOpen,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  MapPin,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEducation } from "../hooks/useEducation";
import { useWasteBanks } from "../hooks/useWasteBanks";
import { adminAPI, uploadToCloudinary } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import WasteBankModal from "../components/WasteBankModal";
import { toast } from "react-hot-toast";
import type { AdminStats, EducationContent, User, WasteBank } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export const Admin: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { content, addContent, updateContent, deleteContent, fetchContent } =
    useEducation();
  const {
    wasteBanks,
    addWasteBank,
    updateWasteBank,
    deleteWasteBank,
    fetchWasteBanks,
  } = useWasteBanks();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "education" | "waste-banks"
  >("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Education Modal States
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<EducationContent | null>(null);

  // Waste Bank Modal States
  const [showWasteBankModal, setShowWasteBankModal] = useState(false);
  const [editingWasteBank, setEditingWasteBank] = useState<WasteBank | null>(
    null
  );

  // Check if user is admin
  const isAdmin = user?.isAdmin === true;

  // Debug user state
  useEffect(() => {
    console.log("👑 Admin Page - User state:", {
      user: user,
      isAdmin: user?.isAdmin,
      email: user?.email,
      loading: authLoading,
    });
  }, [user, authLoading]);

  // Fetch admin data when user is confirmed admin
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      if (activeTab === "users") fetchUsers();
    }
  }, [isAdmin, activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Gagal memuat statistik admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u.uid !== userId));
      toast.success("User berhasil dihapus");
    } catch (error: any) {
      toast.error("Gagal menghapus user");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Yakin ingin menghapus konten edukasi ini?")) return;

    try {
      await deleteContent(id);
      toast.success("Konten berhasil dihapus");
    } catch (error: any) {
      toast.error("Gagal menghapus konten");
    }
  };

  const handleDeleteWasteBank = async (id: string) => {
    if (!confirm("Yakin ingin menghapus bank sampah ini?")) return;

    try {
      await deleteWasteBank(id);
      toast.success("Bank sampah berhasil dihapus");
    } catch (error: any) {
      toast.error("Gagal menghapus bank sampah");
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memeriksa akses admin...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login Diperlukan
          </h1>
          <p className="text-gray-600 mb-4">
            Silakan login terlebih dahulu untuk mengakses panel admin.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-600 mb-4">
            Anda tidak memiliki akses ke halaman admin.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-yellow-800">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Email: {user.email}</p>
              <p>Admin: {user.isAdmin ? "Ya" : "Tidak"}</p>
              <p>UID: {user.uid}</p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Pengguna", icon: Users },
    { id: "education", label: "Edukasi", icon: BookOpen },
    { id: "waste-banks", label: "Bank Sampah", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">
                Selamat datang, {user.displayName || user.email}
              </p>
            </div>
          </div>
          <motion.div
            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            whileHover={{
              y: -5,
              scale: 1.03,
            }}
          >
            Admin Access
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto border-b border-gray-200">
            <nav className="flex whitespace-nowarp">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Statistik Aplikasi</h2>
                  <button
                    onClick={fetchStats}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : stats ? (
                  <div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <motion.div
                        className="bg-blue-50 rounded-lg p-6"
                        whileHover={{
                          y: -5,
                          scale: 1.03,
                        }}
                      >
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">
                              Total Pengguna
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              {stats.totalUsers}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-green-50 rounded-lg p-6"
                        whileHover={{
                          y: -5,
                          scale: 1.03,
                        }}
                      >
                        <div className="flex items-center">
                          <BarChart3 className="h-8 w-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">
                              Total Klasifikasi
                            </p>
                            <p className="text-2xl font-bold text-green-900">
                              {stats.totalClassifications}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-purple-50 rounded-lg p-6"
                        whileHover={{
                          y: -5,
                          scale: 1.03,
                        }}
                      >
                        <div className="flex items-center">
                          <BookOpen className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-purple-600">
                              Konten Edukasi
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {stats.totalEducationContent}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-orange-50 rounded-lg p-6"
                        whileHover={{
                          y: -5,
                          scale: 1.03,
                        }}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-8 w-8 text-orange-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-orange-600">
                              Bank Sampah
                            </p>
                            <p className="text-2xl font-bold text-orange-900">
                              {wasteBanks.length}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Recent Activity */}
                    {stats.recentActivity &&
                      stats.recentActivity.length > 0 && (
                        <div className="bg-white border rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4">
                            Aktivitas Terbaru (30 Hari)
                          </h3>
                          <div className="space-y-2">
                            {stats.recentActivity
                              .slice(0, 7)
                              .map((activity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                                >
                                  <span className="text-sm text-gray-600">
                                    {new Date(activity.date).toLocaleDateString(
                                      "id-ID"
                                    )}
                                  </span>
                                  <div className="flex space-x-4 text-sm">
                                    <span className="text-green-600">
                                      {activity.classifications} klasifikasi
                                    </span>
                                    <span className="text-blue-600">
                                      {activity.newUsers} user baru
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gagal memuat statistik</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
                  <button
                    onClick={fetchUsers}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pengguna
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bergabung
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((userData) => (
                          <tr key={userData.uid}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {userData.photoURL ? (
                                  <img
                                    src={userData.photoURL}
                                    alt={userData.displayName || "User"}
                                    className="h-10 w-10 rounded-full mr-3"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">
                                  {userData.displayName || "No Name"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {userData.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userData.isAdmin
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {userData.isAdmin ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {userData.createdAt
                                ? new Date(
                                  userData.createdAt
                                ).toLocaleDateString("id-ID")
                                : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {userData.uid !== user.uid &&
                                !userData.isAdmin && (
                                  <button
                                    onClick={() =>
                                      handleDeleteUser(userData.uid)
                                    }
                                    className="text-red-600 hover:text-red-900 transition-colors"
                                    title="Hapus User"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada data pengguna</p>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Manajemen Konten Edukasi
                  </h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <button
                      onClick={fetchContent}
                      className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg w-full sm:w-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingEducation(null);
                        setShowEducationModal(true);
                      }}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Konten</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {item.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${item.category === "recycling"
                              ? "bg-blue-100 text-blue-800"
                              : item.category === "composting"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                              }`}
                          >
                            {item.category}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingEducation(item);
                                setShowEducationModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEducation(item._id!)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {item.createdAt && (
                          <div className="text-xs text-gray-400 mt-2">
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {content.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada konten edukasi</p>
                  </div>
                )}
              </div>
            )}

            {/* Waste Banks Tab */}
            {activeTab === "waste-banks" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Manajemen Bank Sampah
                  </h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => fetchWasteBanks()}
                      className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg w-full sm:w-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingWasteBank(null);
                        setShowWasteBankModal(true);
                      }}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Bank Sampah</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wasteBanks.map((bank) => (
                    <div
                      key={bank._id}
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {bank.imageUrl && (
                        <img
                          src={bank.imageUrl}
                          alt={bank.name}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {bank.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          📍 {bank.address}
                        </p>
                        {bank.phone && (
                          <p className="text-sm text-gray-600 mb-2">
                            📞 {bank.phone}
                          </p>
                        )}
                        {bank.operatingHours && (
                          <p className="text-sm text-gray-600 mb-2">
                            🕒 {bank.operatingHours}
                          </p>
                        )}

                        {/* Coordinates */}
                        <p className="text-xs text-gray-500 mb-2">
                          📊 {bank.latitude.toFixed(4)},{" "}
                          {bank.longitude.toFixed(4)}
                        </p>

                        {/* Accepted Wastes */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {bank.acceptedWastes
                              .slice(0, 3)
                              .map((waste, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {waste}
                                </span>
                              ))}
                            {bank.acceptedWastes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{bank.acceptedWastes.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${bank.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {bank.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingWasteBank(bank);
                                setShowWasteBankModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWasteBank(bank._id!)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {bank.distance && (
                          <div className="text-xs text-gray-500 mt-2">
                            📏 {bank.distance.toFixed(1)} km dari lokasi Anda
                          </div>
                        )}

                        {bank.createdAt && (
                          <div className="text-xs text-gray-400 mt-2">
                            {new Date(bank.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {wasteBanks.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Belum ada bank sampah terdaftar
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Education Modal */}
        {showEducationModal && (
          <EducationModal
            education={editingEducation}
            onClose={() => {
              setShowEducationModal(false);
              setEditingEducation(null);
            }}
            onSave={async (data) => {
              try {
                if (editingEducation) {
                  await updateContent(editingEducation._id!, data);
                  toast.success("Konten berhasil diperbarui");
                } else {
                  await addContent(data);
                  toast.success("Konten berhasil ditambahkan");
                }
                setShowEducationModal(false);
                setEditingEducation(null);
              } catch (error: any) {
                toast.error("Gagal menyimpan konten");
              }
            }}
          />
        )}

        {/* Waste Bank Modal */}
        {showWasteBankModal && (
          <WasteBankModal
            wasteBank={editingWasteBank}
            onClose={() => {
              setShowWasteBankModal(false);
              setEditingWasteBank(null);
            }}
            onSave={async (data) => {
              try {
                if (editingWasteBank) {
                  await updateWasteBank(editingWasteBank._id!, data);
                  toast.success("Bank sampah berhasil diperbarui");
                } else {
                  await addWasteBank(data);
                  toast.success("Bank sampah berhasil ditambahkan");
                }
                setShowWasteBankModal(false);
                setEditingWasteBank(null);
              } catch (error: any) {
                toast.error("Gagal menyimpan bank sampah");
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

// Education Modal Component (keep existing code)
interface EducationModalProps {
  education: EducationContent | null;
  onClose: () => void;
  onSave: (
    data: Omit<EducationContent, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const EducationModal: React.FC<EducationModalProps> = ({
  education,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(education?.title || "");
  const [content, setContent] = useState(education?.content || "");
  const [category, setCategory] = useState<
    "recycling" | "composting" | "reduction"
  >(education?.category || "recycling");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(education?.imageUrl || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Judul dan konten harus diisi");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        imageUrl: finalImageUrl,
      });
    } catch (error) {
      toast.error("Gagal menyimpan konten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {education ? "Edit Konten Edukasi" : "Tambah Konten Edukasi"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="button"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan judul konten"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <select
              aria-label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="recycling">Daur Ulang</option>
              <option value="composting">Kompos</option>
              <option value="reduction">Pengurangan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  aria-label="Input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              {(imageUrl || imageFile) && (
                <div className="relative">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    aria-label="Button"
                    onClick={() => {
                      setImageFile(null);
                      setImageUrl("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konten *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan konten edukasi..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim() || !content.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
