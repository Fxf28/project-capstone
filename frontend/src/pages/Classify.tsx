import React, { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useClassification } from "../hooks/useClassification";
import { ClassificationCard } from "../components/ClassificationCard";
import { CameraCapture } from "../components/CameraCapture";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export const Classify: React.FC = () => {
  const { user } = useAuth();
  const { classifyImage, loading, result } = useClassification();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showCamera, setShowCamera] = useState(false);

  // Animate variants
  const bounce = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.4,
      scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
    },
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Silakan pilih file gambar");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Auto classify
      await classifyImage(file, "upload", !!user);
    },
    [classifyImage, user]
  );

  const handleCameraCapture = useCallback(
    async (blob: Blob) => {
      setShowCamera(false);
      setSelectedFile(null);
      setPreviewUrl(URL.createObjectURL(blob));

      // Auto classify camera capture
      await classifyImage(blob, "camera", !!user);
    },
    [classifyImage, user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const resetClassification = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Klasifikasi Sampah
          </h1>
          <p className="text-gray-600">
            Upload gambar atau ambil foto sampah untuk mengidentifikasi jenisnya
            menggunakan AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-gray-400"
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader className="h-12 w-12 text-primary-600 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    Mengklasifikasi gambar...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag & drop gambar di sini
                  </p>
                  <p className="text-gray-500 mb-4">
                    atau pilih salah satu opsi di bawah
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    {/* File Upload Button */}
                    <motion.label
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <input
                        title="input image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={loading}
                      />
                      <Upload className="h-4 w-4" />
                      <span>Pilih File</span>
                    </motion.label>

                    {/* Camera Button */}
                    <motion.button
                      onClick={openCamera}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      disabled={loading}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Camera className="h-4 w-4" />
                      <span>Ambil Foto</span>
                    </motion.button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <ImageIcon className="h-4 w-4" />
                    <span>PNG, JPG, JPEG hingga 10MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preview & Result */}
            {(previewUrl || result) && (
              <div className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Preview */}
                  {previewUrl && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Gambar</h3>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Classification Result */}
                  {result && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Hasil Klasifikasi
                      </h3>
                      <ClassificationCard result={result} />
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={resetClassification}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Klasifikasi Lagi
                  </button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Tips untuk hasil terbaik:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pastikan gambar jelas dan tidak buram</li>
                <li>• Objek sampah terlihat dengan baik</li>
                <li>• Pencahayaan cukup</li>
                <li>• Hindari background yang terlalu ramai</li>
                <li>• Untuk foto kamera, pegang device dengan stabil</li>
              </ul>
            </div>

            {!user && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Login</strong> untuk menyimpan hasil klasifikasi dan
                  mengakses fitur premium lainnya.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={closeCamera}
          loading={loading}
        />
      )}
    </div>
  );
};
