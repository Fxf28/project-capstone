import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">EcoSort</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform klasifikasi sampah berbasis AI yang membantu Anda mengelola sampah dengan lebih efektif dan ramah lingkungan.
            </p>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/classify" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Klasifikasi Sampah
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Edukasi
                </Link>
              </li>
              <li>
                <Link to="/waste-banks" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Bank Sampah
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/chatbot" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  ChatBot AI
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Riwayat Klasifikasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">info@ecosort.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Jl. Teknologi No. 123<br />
                  Jakarta Selatan, 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex justify-center items-center">
            <div className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} EcoSort. Semua hak dilindungi.
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
