import React from 'react';
import { Clock, Camera, Upload } from 'lucide-react';
import type { ClassificationResult } from '../types';

interface ClassificationCardProps {
  result: ClassificationResult;
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWasteTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Cardboard': 'bg-yellow-100 text-yellow-800',
      'Food Organics': 'bg-green-100 text-green-800',
      'Glass': 'bg-blue-100 text-blue-800',
      'Metal': 'bg-gray-100 text-gray-800',
      'Miscellaneous Trash': 'bg-red-100 text-red-800',
      'Paper': 'bg-orange-100 text-orange-800',
      'Plastic': 'bg-purple-100 text-purple-800',
      'Textile Trash': 'bg-pink-100 text-pink-800',
      'Vegetation': 'bg-emerald-100 text-emerald-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {result.imageUrl && (
        <img
          src={result.imageUrl}
          alt="Classified item"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getWasteTypeColor(result.classificationResult)}`}>
            {result.classificationResult}
          </span>
          <div className="text-gray-500">
            {result.method === 'camera' ? (
              <Camera className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
            {result.confidence.toFixed(1)}% yakin
          </span>
          {result.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(result.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          )}
        </div>

        {result.top5 && result.top5.length > 1 && (
          <div className="mt-2 border-t pt-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Top 5 Klasifikasi:</h4>
            <ul className="text-sm space-y-1">
              {result.top5.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className={`${getConfidenceColor(item.confidence)} font-medium`}>
                    {item.confidence.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
