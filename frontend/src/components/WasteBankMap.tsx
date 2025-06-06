import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, Navigation, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WasteBankMap.css'; // Import CSS eksternal
import type { WasteBank } from '../types';

// Fix untuk icon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface WasteBankMapProps {
  wasteBanks: WasteBank[];
  userLocation: { lat: number; lng: number } | null;
  onBankSelect: (bank: WasteBank) => void;
}

const WasteBankMap: React.FC<WasteBankMapProps> = ({
  wasteBanks,
  userLocation,
  onBankSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedBank, setSelectedBank] = useState<WasteBank | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView(
      userLocation ? [userLocation.lat, userLocation.lng] : [-6.2, 106.816666], // Default to Jakarta
      userLocation ? 12 : 10
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `
          <div class="user-location-marker">
            <div class="user-location-dot"></div>
            <div class="user-location-pulse"></div>
          </div>
        `,
        className: 'user-location-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('📍 Lokasi Anda')
        .openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // Update markers when waste banks change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add waste bank markers
    wasteBanks.forEach((bank) => {
      const wasteBankIcon = L.divIcon({
        html: `
          <div class="waste-bank-marker ${bank.isActive ? 'active' : 'inactive'}">
            <div class="waste-bank-icon">
              🏦
            </div>
          </div>
        `,
        className: 'waste-bank-icon-wrapper',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker([bank.latitude, bank.longitude], { icon: wasteBankIcon })
        .addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div class="waste-bank-popup">
          <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #1f2937;">${bank.name}</h3>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${bank.address}</p>
          ${bank.distance ? `<p style="font-size: 12px; color: #2563eb; margin-bottom: 8px;">📍 ${bank.distance.toFixed(1)} km</p>` : ''}
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${bank.acceptedWastes.slice(0, 3).map(waste =>
        `<span style="background: #dcfce7; color: #166534; font-size: 10px; padding: 2px 8px; border-radius: 12px;">${waste}</span>`
      ).join('')}
            ${bank.acceptedWastes.length > 3 ? `<span style="color: #6b7280; font-size: 10px;">+${bank.acceptedWastes.length - 3} lainnya</span>` : ''}
          </div>
          <button 
            onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}', '_blank')"
            style="margin-top: 8px; width: 100%; background: #2563eb; color: white; font-size: 12px; padding: 6px 8px; border-radius: 6px; border: none; cursor: pointer;"
            onmouseover="this.style.background='#1d4ed8'"
            onmouseout="this.style.background='#2563eb'"
          >
            🧭 Navigasi
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'custom-popup'
      });

      marker.on('click', () => {
        setSelectedBank(bank);
        onBankSelect(bank);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (wasteBanks.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [wasteBanks, onBankSelect]);

  const openInMaps = (bank: WasteBank) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="waste-bank-map-container">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg z-10" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs z-1000">
        <h4 className="font-semibold mb-2 text-gray-800">Legenda</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
            <span className="text-gray-700">Lokasi Anda</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span className="text-gray-700">Bank Sampah Aktif</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span className="text-gray-700">Bank Sampah Tutup</span>
          </div>
        </div>
      </div>

      {/* Bank Details Card (when selected) */}
      {selectedBank && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm z-1000 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">{selectedBank.name}</h3>
            <button
              title='Select Bank'
              onClick={() => setSelectedBank(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{selectedBank.address}</span>
            </div>

            {selectedBank.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a
                  href={`tel:${selectedBank.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedBank.phone}
                </a>
              </div>
            )}

            {selectedBank.operatingHours && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{selectedBank.operatingHours}</span>
              </div>
            )}

            {selectedBank.distance && (
              <div className="text-primary-600 font-medium">
                📍 {selectedBank.distance.toFixed(1)} km dari lokasi Anda
              </div>
            )}

            {selectedBank.description && (
              <div className="text-gray-600">
                <strong>Deskripsi:</strong> {selectedBank.description}
              </div>
            )}
          </div>

          {/* Accepted Wastes */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Jenis Sampah yang Diterima:</div>
            <div className="flex flex-wrap gap-1">
              {selectedBank.acceptedWastes.map((waste, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {waste}
                </span>
              ))}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBank.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {selectedBank.isActive ? '🟢 Sedang Buka' : '🔴 Tutup'}
              </span>
            </div>

            <button
              onClick={() => openInMaps(selectedBank)}
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Buka di Google Maps</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteBankMap;