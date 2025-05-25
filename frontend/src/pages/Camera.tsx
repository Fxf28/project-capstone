import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, RotateCcw, Download } from 'lucide-react';
import { useClassification } from '../hooks/useClassification';
import { ClassificationCard } from '../components/ClassificationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const { classifyImage, loading, result } = useClassification();
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error('Gagal mengambil gambar');
      return;
    }

    setCapturedImage(imageSrc);

    // Convert base64 to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    // Classify the image
    await classifyImage(blob, 'camera', true);
  }, [classifyImage]);

  const retake = () => {
    setCapturedImage('');
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Cleanup effect to stop webcam stream on unmount
  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Kamera Klasifikasi
          </h1>
          <p className="text-gray-600">
            Gunakan kamera untuk mengklasifikasi sampah secara real-time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Camera Section */}
            <div className="mb-6">
              {!capturedImage ? (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full rounded-lg"
                  />
                  
                  {/* Camera Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button
                      onClick={toggleCamera}
                      className="bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                      title="Ganti Kamera"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={capture}
                      disabled={loading}
                      className="bg-primary-600 text-white p-4 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50"
                      title="Ambil Foto"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <CameraIcon className="h-8 w-8" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full max-w-md mx-auto rounded-lg mb-4"
                  />
                  <button
                    onClick={retake}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Ambil Ulang
                  </button>
                </div>
              )}
            </div>

            {/* Classification Result */}
            {result && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Hasil Klasifikasi</h3>
                <ClassificationCard result={result} />
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Cara Penggunaan:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Arahkan kamera ke objek sampah</li>
                <li>• Pastikan objek terlihat jelas dalam frame</li>
                <li>• Tekan tombol kamera untuk mengambil foto</li>
                <li>• AI akan mengklasifikasi jenis sampah secara otomatis</li>
                <li>• Hasil akan disimpan ke akun Anda</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
