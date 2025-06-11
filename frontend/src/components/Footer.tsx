import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { signInWithGoogle } from '../services/firebase';

const Footer: React.FC = () => {
  const { user } = useAuth();

  const handleProtectedClick = (path: string) => {
    if (user) {
      window.location.href = path;
    } else {
      Swal.fire({
        title: "Akses Ditolak",
        text: "Silakan login dengan Google untuk mengakses fitur ini.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login dengan Google",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          signInWithGoogle();
        }
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="EcoSort Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">EcoSort</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform klasifikasi sampah berbasis AI yang membantu Anda
              mengelola sampah dengan lebih efektif dan ramah lingkungan.
            </p>
            <div className="flex space-x-4">
              <Link
                to="https://facebook.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                to="https://x.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                to="https://instagram.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                to="https://youtube.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/classify"
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Klasifikasi Sampah
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Services (Protected) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleProtectedClick("/education")}
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm text-left"
                >
                  Edukasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedClick("/waste-banks")}
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm text-left"
                >
                  Bank Sampah
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedClick("/chatbot")}
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm text-left"
                >
                  ChatBot AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedClick("/history")}
                  className="text-gray-300 hover:text-primary-400 transition-colors text-sm text-left"
                >
                  Riwayat Klasifikasi
                </button>
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
                  Jl. Teknologi No. 123
                  <br />
                  Jakarta Selatan, 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EcoSort. Semua hak dilindungi.
            </div>
            <div className="flex space-x-6">
              <p className="text-gray-400 text-sm">CC25-CF014</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;