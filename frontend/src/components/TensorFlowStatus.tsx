import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { tensorflowService } from '../services/tensorflow';

interface TensorFlowStatusProps {
  onRetry?: () => void;
}

export const TensorFlowStatus: React.FC<TensorFlowStatusProps> = ({ onRetry }) => {
  const [status, setStatus] = useState<{
    backend: string;
    ready: boolean;
  }>({ backend: 'loading', ready: false });
  
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    if (!status.ready) return 'text-yellow-600 bg-yellow-100';
    if (status.backend === 'cpu') return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = () => {
    if (!status.ready) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status.backend === 'cpu') return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!status.ready) return 'Loading AI Model...';
    if (status.backend === 'cpu') return 'AI Ready (CPU Mode)';
    return 'AI Ready (GPU Accelerated)';
  };

  const getStatusDescription = () => {
    if (!status.ready) return 'Please wait while the AI model is being loaded.';
    if (status.backend === 'cpu') return 'Running on CPU. Classification may be slower but will work reliably.';
    return 'Running on GPU. Fast and efficient classification available.';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">AI Status</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!status.ready && onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Retry
            </button>
          )}
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="mb-2">{getStatusDescription()}</p>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Backend:</span> {status.backend}
              </div>
              <div>
                <span className="font-medium">Status:</span> {status.ready ? 'Ready' : 'Loading'}
              </div>
            </div>

            {status.backend === 'cpu' && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <p className="font-medium mb-1">Running on CPU Mode</p>
                    <p>Your device doesn't support GPU acceleration or WebGL context was lost. Classification will work but may be slower.</p>
                  </div>
                </div>
              </div>
            )}

            {!status.ready && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <RefreshCw className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0 animate-spin" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-medium mb-1">Loading AI Model</p>
                    <p>The machine learning model is being loaded. This may take a few moments on first use.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};