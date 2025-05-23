import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { tensorflowService } from './services/tensorflow';

// Components
import { Navbar } from './components/Navbar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TensorFlowErrorBoundary } from './components/ErrorBoundary';

// Pages
import { Home } from './pages/Home';
import { Classify } from './pages/Classify';
import { Camera } from './pages/Camera';
import { Education } from './pages/Education';
import { EducationDetail } from './pages/EducationDetail';
import { Chatbot } from './pages/Chatbot';
import { WasteBanks } from './pages/WasteBanks';
import { About } from './pages/About';
import { History } from './pages/History';
import { Admin } from './pages/Admin';

// Hooks
import { useAuth } from './hooks/useAuth';

// Debug Component untuk melihat auth state
const AuthDebug: React.FC = () => {
  const { user, loading } = useAuth();

  console.log('🔍 Auth Debug:', {
    user: user ? {
      uid: user.uid,
      email: user.email,
      isAdmin: user.isAdmin
    } : null,
    loading
  });

  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Admin: {user?.isAdmin ? 'Yes' : 'No'}</div>
      </div>
    );
  }

  return null;
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false
}) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute check:', {
    requireAuth,
    requireAdmin,
    user: user ? { email: user.email, isAdmin: user.isAdmin } : null,
    loading
  });

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    console.log('❌ Auth required but no user, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check admin requirement
  if (requireAdmin && (!user || !user.isAdmin)) {
    console.log('❌ Admin required but user is not admin:', {
      hasUser: !!user,
      isAdmin: user?.isAdmin
    });
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute passed, rendering children');
  return <>{children}</>;
};

const App: React.FC = () => {
  // Preload TensorFlow.js model
  useEffect(() => {
    const preloadModel = async () => {
      try {
        console.log('Preloading TensorFlow.js model...');
        await tensorflowService.loadModel();
        console.log('Model preloaded successfully');
      } catch (error) {
        console.warn('Failed to preload model:', error);
      }
    };

    preloadModel();
  }, []);

  return (
    <TensorFlowErrorBoundary>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />

          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/classify" element={<Classify />} />
              <Route path="/about" element={<About />} />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/camera"
                element={
                  <ProtectedRoute requireAuth>
                    <Camera />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/education"
                element={
                  <ProtectedRoute requireAuth>
                    <Education />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/education/:id"
                element={
                  <ProtectedRoute requireAuth>
                    <EducationDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <ProtectedRoute requireAuth>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/waste-banks"
                element={
                  <ProtectedRoute requireAuth>
                    <WasteBanks />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute requireAuth>
                    <History />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </TensorFlowErrorBoundary>
  );
};

export default App;