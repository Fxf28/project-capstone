import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, BookOpen, MessageCircle, MapPin, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Klasifikasi Sampah dengan <span className="text-primary-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EcoSort membantu Anda mengidentifikasi jenis sampah menggunakan teknologi AI untuk mendukung daur ulang yang lebih efektif.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/classify"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Mulai Klasifikasi
            </Link>
            <Link
              to="/about"
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Gambar</h3>
              <p className="text-gray-600">
                Upload foto sampah dan dapatkan klasifikasi instan dengan AI
              </p>
            </div>

            {user && (
              <>
                <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <Camera className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Kamera Live</h3>
                  <p className="text-gray-600">
                    Gunakan kamera untuk klasifikasi real-time
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Edukasi</h3>
                  <p className="text-gray-600">
                    Pelajari cara daur ulang dan pengelolaan sampah
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">EcoBot</h3>
                  <p className="text-gray-600">
                    Chatbot AI untuk konsultasi pengelolaan sampah
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Bank Sampah</h3>
                  <p className="text-gray-600">
                    Temukan lokasi bank sampah terdekat
                  </p>
                </div>
              </>
            )}

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Leaf className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ramah Lingkungan</h3>
              <p className="text-gray-600">
                Berkontribusi untuk lingkungan yang lebih bersih
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Dampak Positif
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">9</div>
              <div className="text-xl">Jenis Sampah</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-xl">Akurasi AI</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl">Tersedia</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bergabunglah dengan EcoSort
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Daftar sekarang untuk mengakses semua fitur premium dan berkontribusi untuk lingkungan yang lebih baik.
            </p>
            <Link
              to="/classify"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Mulai Sekarang
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};