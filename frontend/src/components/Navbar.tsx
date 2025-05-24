import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../services/firebase';
import { toast } from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Login berhasil!');
    } catch (error) {
      toast.error('Login gagal. Silakan coba lagi.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout berhasil!');
      navigate('/');
    } catch (error) {
      toast.error('Logout gagal.');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = (
    <>
      <Link
        to="/"
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-500 hover:text-gray-700'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Beranda
      </Link>
      <Link
        to="/classify"
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/classify')
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-500 hover:text-gray-700'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Klasifikasi
      </Link>
      {user && (
        <>
          <Link to="/education" className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive('/education') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Edukasi</Link>
          <Link to="/chatbot" className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive('/chatbot') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>ChatBot</Link>
          <Link to="/history" className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive('/history') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Riwayat</Link>
          <Link to="/waste-banks" className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive('/waste-banks') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Bank Sampah</Link>
        </>
      )}
      <Link
        to="/about"
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-500 hover:text-gray-700'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Tentang
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EcoSort</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">{navItems}</div>

          {/* Mobile Burger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Login dengan Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1 bg-white shadow-md border-t">
          {navItems}
          <div className="mt-2">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            ) : user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-3 py-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="user" className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Login dengan Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
