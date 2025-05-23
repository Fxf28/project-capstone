import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Phone, Image, Plus, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import type { WasteBank } from '../types';

interface WasteBankModalProps {
  wasteBank: WasteBank | null;
  onClose: () => void;
  onSave: (data: Omit<WasteBank, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const WasteBankModal: React.FC<WasteBankModalProps> = ({ wasteBank, onClose, onSave }) => {
  const [name, setName] = useState(wasteBank?.name || '');
  const [address, setAddress] = useState(wasteBank?.address || '');
  const [latitude, setLatitude] = useState(wasteBank?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(wasteBank?.longitude?.toString() || '');
  const [phone, setPhone] = useState(wasteBank?.phone || '');
  const [operatingHours, setOperatingHours] = useState(wasteBank?.operatingHours || '');
  const [description, setDescription] = useState(wasteBank?.description || '');
  const [acceptedWastes, setAcceptedWastes] = useState<string[]>(wasteBank?.acceptedWastes || ['Plastik']);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(wasteBank?.imageUrl || '');
  const [isActive, setIsActive] = useState(wasteBank?.isActive !== false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Predefined waste types
  const wasteTypes = [
    'Plastik', 'Kertas', 'Logam', 'Kaca', 'Kardus', 
    'Botol Plastik', 'Kaleng', 'Elektronik', 'Karet',
    'Tekstil', 'Minyak Jelantah', 'Sampah Organik'
  ];

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation tidak didukung browser ini');
      return;
    }

    setGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      setLatitude(position.coords.latitude.toFixed(6));
      setLongitude(position.coords.longitude.toFixed(6));
      toast.success('Lokasi berhasil dideteksi');
    } catch (error) {
      toast.error('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
    } finally {
      setGettingLocation(false);
    }
  };

  const addWasteType = (wasteType: string) => {
    if (!acceptedWastes.includes(wasteType)) {
      setAcceptedWastes(prev => [...prev, wasteType]);
    }
  };

  const removeWasteType = (wasteType: string) => {
    setAcceptedWastes(prev => prev.filter(w => w !== wasteType));
  };

  const addCustomWasteType = () => {
    const customType = prompt('Masukkan jenis sampah baru:');
    if (customType && customType.trim() && !acceptedWastes.includes(customType.trim())) {
      setAcceptedWastes(prev => [...prev, customType.trim()]);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      toast.error('Nama bank sampah harus diisi');
      return;
    }

    if (!address.trim()) {
      toast.error('Alamat harus diisi');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('Koordinat (latitude dan longitude) harus diisi');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Koordinat tidak valid');
      return;
    }

    if (acceptedWastes.length === 0) {
      toast.error('Minimal satu jenis sampah harus dipilih');
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
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        phone: phone.trim() || undefined,
        operatingHours: operatingHours.trim() || undefined,
        description: description.trim() || undefined,
        acceptedWastes,
        imageUrl: finalImageUrl || undefined,
        isActive
      });
    } catch (error) {
      toast.error('Gagal menyimpan bank sampah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {wasteBank ? 'Edit Bank Sampah' : 'Tambah Bank Sampah'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Bank Sampah *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan nama bank sampah"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Contoh: (021) 1234-5678"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan alamat lengkap bank sampah"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Koordinat Lokasi *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="-6.200000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="106.800000"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {gettingLocation ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{gettingLocation ? 'Mencari...' : 'Lokasi Saya'}</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gunakan Google Maps untuk mendapatkan koordinat yang akurat
            </p>
          </div>

          {/* Operating Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Senin-Sabtu 08:00-16:00"
            />
          </div>

          {/* Accepted Wastes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Sampah yang Diterima *
            </label>
            
            {/* Selected Wastes */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {acceptedWastes.map((waste, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {waste}
                    <button
                      onClick={() => removeWasteType(waste)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Available Waste Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {wasteTypes.map((wasteType) => (
                <button
                  key={wasteType}
                  type="button"
                  onClick={() => addWasteType(wasteType)}
                  disabled={acceptedWastes.includes(wasteType)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    acceptedWastes.includes(wasteType)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {wasteType}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={addCustomWasteType}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Jenis Sampah Lain</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Tambahan
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Informasi tambahan tentang bank sampah (opsional)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Bank Sampah
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
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
                    onClick={() => {
                      setImageFile(null);
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Bank sampah aktif dan dapat dicari oleh pengguna
              </span>
            </label>
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
            disabled={loading || !name.trim() || !address.trim() || !latitude || !longitude || acceptedWastes.length === 0}
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

export default WasteBankModal;