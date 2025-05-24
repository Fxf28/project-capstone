import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Brain, Monitor } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType: 'tensorflow' | 'webgl' | 'memory' | 'generic';
}

export class TensorFlowErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorType: 'generic'
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Analyze error type
    let errorType: State['errorType'] = 'generic';
    
    if (error.message.includes('WebGL') || error.message.includes('CONTEXT_LOST')) {
      errorType = 'webgl';
    } else if (error.message.includes('TensorFlow') || error.message.includes('tensor')) {
      errorType = 'tensorflow';
    } else if (error.message.includes('memory') || error.message.includes('OOM')) {
      errorType = 'memory';
    }

    return {
      hasError: true,
      error,
      errorType
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external service if needed
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorType: 'generic'
    });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  getErrorContent() {
    const { errorType, error } = this.state;

    const errorConfigs = {
      webgl: {
        icon: <Monitor className="h-12 w-12 text-red-500" />,
        title: 'WebGL Context Error',
        description: 'Ada masalah dengan rendering grafis di browser Anda.',
        suggestions: [
          'Refresh halaman untuk memulai ulang WebGL context',
          'Pastikan browser mendukung WebGL 2.0',
          'Coba gunakan browser Chrome atau Firefox terbaru',
          'Periksa apakah hardware acceleration diaktifkan'
        ],
        actions: [
          { label: 'Refresh Halaman', action: this.handleRefresh, primary: true },
          { label: 'Coba Lagi', action: this.handleReset, primary: false }
        ]
      },
      tensorflow: {
        icon: <Brain className="h-12 w-12 text-red-500" />,
        title: 'TensorFlow.js Error',
        description: 'Terjadi masalah dengan model machine learning.',
        suggestions: [
          'Model AI mungkin tidak ter-load dengan benar',
          'Koneksi internet mungkin terputus saat loading model',
          'Browser mungkin kehabisan memory',
          'Coba dengan gambar yang lebih kecil'
        ],
        actions: [
          { label: 'Muat Ulang Model', action: this.handleRefresh, primary: true },
          { label: 'Coba Lagi', action: this.handleReset, primary: false }
        ]
      },
      memory: {
        icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        title: 'Memory Error',
        description: 'Browser kehabisan memori untuk memproses gambar.',
        suggestions: [
          'Gunakan gambar dengan ukuran lebih kecil (< 5MB)',
          'Tutup tab browser lain yang tidak diperlukan',
          'Restart browser untuk membersihkan cache',
          'Coba gunakan device dengan RAM lebih besar'
        ],
        actions: [
          { label: 'Refresh & Bersihkan Memory', action: this.handleRefresh, primary: true },
          { label: 'Coba Lagi', action: this.handleReset, primary: false }
        ]
      },
      generic: {
        icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
        title: 'Unexpected Error',
        description: 'Terjadi kesalahan yang tidak terduga.',
        suggestions: [
          'Coba refresh halaman',
          'Periksa koneksi internet',
          'Coba gunakan browser berbeda',
          'Hubungi support jika masalah berlanjut'
        ],
        actions: [
          { label: 'Refresh Halaman', action: this.handleRefresh, primary: true },
          { label: 'Coba Lagi', action: this.handleReset, primary: false }
        ]
      }
    };

    return errorConfigs[errorType];
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorConfig = this.getErrorContent();

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              {errorConfig.icon}
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {errorConfig.title}
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 mb-6">
              {errorConfig.description}
            </p>

            {/* Suggestions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Saran Perbaikan:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {errorConfig.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {errorConfig.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    action.primary
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {action.primary && <RefreshCw className="h-4 w-4" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Technical Details (Collapsible) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error?.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.error?.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Browser Info */}
            <div className="mt-6 text-xs text-gray-500">
              Browser: {navigator.userAgent.split(' ').slice(-2).join(' ')}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component wrapper
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <TensorFlowErrorBoundary>
      <Component {...props} />
    </TensorFlowErrorBoundary>
  );
};