import React from 'react';
import { CheckCircle, AlertCircle, Info, Recycle, Leaf, Package, Trash2, Lightbulb } from 'lucide-react';
import type { ClassificationResult as ClassificationResultType } from '../types';

interface ClassificationResultProps {
  result: ClassificationResultType;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({ result }) => {
  // Get confidence level styling
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-5 w-5" />;
    if (confidence >= 60) return <AlertCircle className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  // Get waste type specific info
  const getWasteTypeInfo = (wasteType: string) => {
    const wasteInfo = {
      'Cardboard': {
        icon: <Package className="h-6 w-6" />,
        color: 'bg-yellow-500',
        category: 'Dapat Didaur Ulang',
        description: 'Kardus dan kertas tebal',
        tips: [
          'Pastikan kardus bersih dan kering',
          'Lepaskan selotip dan staples',
          'Lipat atau potong untuk menghemat ruang'
        ],
        disposal: 'Tempat sampah biru (daur ulang)'
      },
      'Food Organics': {
        icon: <Leaf className="h-6 w-6" />,
        color: 'bg-green-500',
        category: 'Organik',
        description: 'Sisa makanan dan bahan organik',
        tips: [
          'Dapat dijadikan kompos',
          'Pisahkan dari sampah anorganik',
          'Proses dalam 1-2 hari'
        ],
        disposal: 'Tempat sampah hijau (organik)'
      },
      'Glass': {
        icon: <Package className="h-6 w-6" />,
        color: 'bg-blue-500',
        category: 'Dapat Didaur Ulang',
        description: 'Botol dan wadah kaca',
        tips: [
          'Cuci bersih sebelum dibuang',
          'Lepaskan tutup logam/plastik',
          'Hati-hati saat menangani pecahan'
        ],
        disposal: 'Tempat sampah biru (daur ulang)'
      },
      'Metal': {
        icon: <Package className="h-6 w-6" />,
        color: 'bg-gray-500',
        category: 'Dapat Didaur Ulang',
        description: 'Kaleng dan logam',
        tips: [
          'Cuci kaleng bekas makanan',
          'Lepaskan label jika memungkinkan',
          'Hindari logam berkarat'
        ],
        disposal: 'Tempat sampah biru (daur ulang)'
      },
      'Miscellaneous Trash': {
        icon: <Trash2 className="h-6 w-6" />,
        color: 'bg-gray-700',
        category: 'Sampah Umum',
        description: 'Sampah campur yang tidak dapat didaur ulang',
        tips: [
          'Kurangi penggunaan produk sekali pakai',
          'Pertimbangkan alternatif yang dapat didaur ulang',
          'Buang ke tempat sampah biasa'
        ],
        disposal: 'Tempat sampah hitam (umum)'
      },
      'Paper': {
        icon: <Package className="h-6 w-6" />,
        color: 'bg-orange-500',
        category: 'Dapat Didaur Ulang',
        description: 'Kertas dan dokumen',
        tips: [
          'Pastikan kertas bersih dan kering',
          'Lepaskan klip dan staples',
          'Kertas berminyak tidak dapat didaur ulang'
        ],
        disposal: 'Tempat sampah biru (daur ulang)'
      },
      'Plastic': {
        icon: <Recycle className="h-6 w-6" />,
        color: 'bg-purple-500',
        category: 'Dapat Didaur Ulang',
        description: 'Botol dan wadah plastik',
        tips: [
          'Cuci bersih dari sisa makanan',
          'Lepaskan label jika memungkinkan',
          'Periksa kode daur ulang di bawah kemasan'
        ],
        disposal: 'Tempat sampah biru (daur ulang)'
      },
      'Textile Trash': {
        icon: <Package className="h-6 w-6" />,
        color: 'bg-pink-500',
        category: 'Dapat Didaur Ulang',
        description: 'Kain dan tekstil',
        tips: [
          'Donasikan jika masih layak pakai',
          'Pisahkan kancing dan ritsleting',
          'Dapat dijadikan kain lap'
        ],
        disposal: 'Bank sampah atau donasi'
      },
      'Vegetation': {
        icon: <Leaf className="h-6 w-6" />,
        color: 'bg-emerald-500',
        category: 'Organik',
        description: 'Daun dan ranting',
        tips: [
          'Sangat baik untuk kompos',
          'Dapat dicacah untuk mempercepat dekomposisi',
          'Campurkan dengan sampah organik lain'
        ],
        disposal: 'Tempat sampah hijau (organik)'
      }
    };

    return wasteInfo[wasteType as keyof typeof wasteInfo] || wasteInfo['Miscellaneous Trash'];
  };

  const wasteInfo = getWasteTypeInfo(result.classificationResult);
  const confidenceLevel = result.confidence;

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white mb-4 ${wasteInfo.color}`}>
          {wasteInfo.icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {result.classificationResult}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {wasteInfo.description}
        </p>

        {/* Confidence Score */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getConfidenceColor(confidenceLevel)}`}>
          {getConfidenceIcon(confidenceLevel)}
          <span className="font-medium">
            {confidenceLevel}% Confidence
          </span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          wasteInfo.category === 'Dapat Didaur Ulang' 
            ? 'bg-blue-100 text-blue-800' 
            : wasteInfo.category === 'Organik'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {wasteInfo.category}
        </span>
      </div>

      {/* Disposal Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-600 rounded-full p-2">
            <Trash2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Cara Pembuangan</h4>
            <p className="text-blue-800 text-sm">
              {wasteInfo.disposal}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-600 rounded-full p-2">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-2">Tips Pengolahan</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              {wasteInfo.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-green-600 rounded-full p-2">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Dampak Lingkungan</h4>
            <p className="text-green-800 text-sm">
              {wasteInfo.category === 'Dapat Didaur Ulang' && 
                'Dengan mendaur ulang sampah ini, Anda membantu mengurangi penggunaan bahan baku baru dan menghemat energi.'
              }
              {wasteInfo.category === 'Organik' && 
                'Sampah organik dapat dijadikan kompos yang bermanfaat untuk tanaman dan mengurangi emisi metana di TPA.'
              }
              {wasteInfo.category === 'Sampah Umum' && 
                'Kurangi penggunaan produk sejenis dengan memilih alternatif yang lebih ramah lingkungan.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Low Confidence Warning */}
      {confidenceLevel < 60 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">Tingkat Kepercayaan Rendah</h4>
              <p className="text-orange-800 text-sm">
                AI kurang yakin dengan klasifikasi ini. Pertimbangkan untuk:
              </p>
              <ul className="text-orange-800 text-sm mt-2 space-y-1">
                <li>• Mengambil foto dengan pencahayaan yang lebih baik</li>
                <li>• Memfokuskan kamera pada objek sampah</li>
                <li>• Memastikan hanya ada satu jenis sampah dalam foto</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Classification Details */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>
          Diklasifikasi pada {new Date(result.createdAt!).toLocaleString('id-ID')} 
          {' '} menggunakan {result.method === 'camera' ? 'kamera' : 'upload'}
        </p>
      </div>
    </div>
  );
};