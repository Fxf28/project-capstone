import React from 'react';
import { X, Download } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onClose,
  onDownload,
  className = ''
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-lg shadow-md"
      />
      
      {(onClose || onDownload) && (
        <div className="absolute top-2 right-2 flex space-x-2">
          {onDownload && (
            <button
              onClick={onDownload || handleDownload}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};