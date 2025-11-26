import { useState } from 'react';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

interface MapViewProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  city: string;
  country: string;
}

export const MapView = ({ latitude, longitude, name, address, city, country }: MapViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };



  const getOpenStreetMapUrl = () => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        <FaMapMarkerAlt /> View on Map
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                <p className="text-gray-600 mt-1">{address}</p>
                <p className="text-gray-500 text-sm">{city}, {country}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close map"
              >
                <FaTimes className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Map - Using OpenStreetMap (no API key required) */}
            <div className="relative h-96 bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={getOpenStreetMapUrl()}
                title={`Map showing ${name}`}
              />
            </div>

            {/* Location Details */}
            <div className="p-6 bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">Location Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Latitude</p>
                  <p className="font-mono font-semibold">{latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Longitude</p>
                  <p className="font-mono font-semibold">{longitude.toFixed(6)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Full Address</p>
                  <p className="font-semibold">{address}, {city}, {country}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t flex gap-4">
              <button
                onClick={openInGoogleMaps}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt /> Open in Google Maps
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
