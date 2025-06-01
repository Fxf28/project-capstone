import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Recycle,
  Navigation,
  Search,
  RefreshCw,
  AlertCircle,
  Map as MapIcon,
  Grid3X3,
} from "lucide-react";
import { useWasteBanks } from "../hooks/useWasteBanks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import WasteBankMap from "../components/WasteBankMap";
import type { WasteBank } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export const WasteBanks: React.FC = () => {
  const { wasteBanks, loading, fetchWasteBanks } = useWasteBanks();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Get user location
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch waste banks with location if available
  useEffect(() => {
    const params = userLocation
      ? {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 50, // 50km radius
        }
      : undefined;

    fetchWasteBanks(params);
  }, [userLocation, fetchWasteBanks]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationLoading(false);
        // Still fetch waste banks without location
        fetchWasteBanks();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort waste banks
  const filteredWasteBanks = wasteBanks
    .filter(
      (bank) =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((bank) => ({
      ...bank,
      distance: userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            bank.latitude,
            bank.longitude
          )
        : bank.distance, // Use distance from API if available
    }))
    .sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });

  const openInMaps = (bank: WasteBank) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}`;
    window.open(url, "_blank");
  };

  const handleRefresh = () => {
    const params = userLocation
      ? {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 50,
        }
      : undefined;

    fetchWasteBanks(params);
  };

  const WasteBankCard: React.FC<{
    bank: WasteBank & { distance?: number };
  }> = ({ bank }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {bank.imageUrl && (
        <img
          src={bank.imageUrl}
          alt={bank.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bank.name}
            </h3>
            <div className="flex items-start space-x-2 text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <span className="text-sm">{bank.address}</span>
            </div>
            {bank.distance && (
              <div className="text-sm text-primary-600 font-medium">
                📍 {bank.distance.toFixed(1)} km dari lokasi Anda
              </div>
            )}
          </div>
          <button
            onClick={() => openInMaps(bank)}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
            title="Buka di Maps"
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {bank.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <a href={`tel:${bank.phone}`} className="hover:text-primary-600">
                {bank.phone}
              </a>
            </div>
          )}
          {bank.operatingHours && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{bank.operatingHours}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {bank.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{bank.description}</p>
          </div>
        )}

        {/* Accepted Wastes */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Recycle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              Jenis Sampah:
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {bank.acceptedWastes.map((waste, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {waste}
              </span>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              bank.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {bank.isActive ? "🟢 Buka" : "🔴 Tutup"}
          </span>

          {bank.createdAt && (
            <span className="text-xs text-gray-400">
              Ditambahkan:{" "}
              {new Date(bank.createdAt).toLocaleDateString("id-ID")}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bank Sampah Terdekat
          </h1>
          <p className="text-gray-600">
            Temukan bank sampah di sekitar Anda untuk mendaur ulang sampah
            dengan nilai ekonomis
          </p>
        </div>

        {/* Search, View Mode, and Refresh */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari bank sampah berdasarkan nama atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "map"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <MapIcon className="h-4 w-4" />
                <span>Peta</span>
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Location Status */}
        {locationLoading ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-blue-800">Mendeteksi lokasi Anda...</span>
            </div>
          </div>
        ) : userLocation ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Lokasi Anda berhasil dideteksi. Bank sampah diurutkan
                berdasarkan jarak terdekat.
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">
                Izinkan akses lokasi untuk melihat bank sampah terdekat dari
                Anda.
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Memuat bank sampah...</p>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {!loading && (
          <>
            {viewMode === "map" ? (
              /* Map View */
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
                style={{ height: "600px" }}
              >
                <WasteBankMap
                  wasteBanks={filteredWasteBanks}
                  userLocation={userLocation}
                  onBankSelect={(bank) => {
                    // Scroll to bank details or open modal
                    console.log("Selected bank:", bank);
                  }}
                />
              </motion.div>
            ) : (
              /* Grid View */
              <>
                {filteredWasteBanks.length > 0 ? (
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredWasteBanks.map((bank) => (
                      <WasteBankCard key={bank._id || bank.name} bank={bank} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 mb-8">
                    {wasteBanks.length === 0 ? (
                      <>
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <motion.h3 className="text-lg font-medium text-gray-900 mb-2">
                          Belum ada bank sampah terdaftar
                        </motion.h3>
                        <motion.p className="text-gray-600 mb-4">
                          Admin belum menambahkan bank sampah atau terjadi
                          masalah koneksi
                        </motion.p>
                        <motion.button
                          onClick={handleRefresh}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Coba Muat Ulang
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <motion.h3 className="text-lg font-medium text-gray-900 mb-2">
                          Tidak ada bank sampah ditemukan
                        </motion.h3>
                        <p className="text-gray-600">
                          Coba ubah kata kunci pencarian atau periksa ejaan
                        </p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Info Section */}
        <motion.div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Mengapa Bank Sampah?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <Recycle className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Nilai Ekonomis</h3>
              <p className="text-sm opacity-90">
                Sampah Anda memiliki nilai jual dan bisa menjadi penghasilan
                tambahan
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Mudah Diakses</h3>
              <p className="text-sm opacity-90">
                Bank sampah tersebar di berbagai lokasi untuk memudahkan akses
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Jam Operasional</h3>
              <p className="text-sm opacity-90">
                Buka sesuai jadwal yang fleksibel untuk kenyamanan Anda
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
