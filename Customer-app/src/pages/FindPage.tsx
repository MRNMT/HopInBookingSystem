import { Button } from "../components/Button";
import { FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import hotel from '../assets/hotel1.jpg';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAccommodations } from "../services/accommodation.service";
import { getHotelImages } from "../services/unsplash.service";
import { addFavorite, removeFavorite, getFavorites } from "../services/favorites.service";
import { getAccommodationsFromCache, saveAccommodationsToCache } from "../utils/accommodationCache";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

interface AccommodationWithImage {
  id: string;
  name: string;
  city: string;
  country: string;
  star_rating: number;
  address: string;
  image: string;
  latitude: number;
  longitude: number;
  min_price: number;
  max_capacity: number;
}

export const FindPage = () => {
  const [filters, setFilters] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
  });

  const [accommodations, setAccommodations] = useState<AccommodationWithImage[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<AccommodationWithImage[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading accommodations...');
        
        const cachedAccommodations = getAccommodationsFromCache();
        
        if (cachedAccommodations && cachedAccommodations.length > 0) {
          const hasImages = cachedAccommodations[0].image && cachedAccommodations[0].image.startsWith('http');
          
          if (hasImages) {
            console.log('⚡ Using cached accommodations WITH images from localStorage');
            setAccommodations(cachedAccommodations);
            setFilteredAccommodations(cachedAccommodations);
            setIsLoading(false);
            
            if (isAuthenticated) {
               const favData = await getFavorites();
               const favIds = new Set<string>(favData.data.map((fav: any) => fav.id as string));
               setFavorites(favIds);
            }
            return;
          } else {
            console.log('Cached data found but missing images. Re-fetching to get images...');
          }
        }

        console.log('Fetching accommodations from API...');
        const accomData = await getAllAccommodations();
        
        let accommodationsList = [];
        if (Array.isArray(accomData)) {
          accommodationsList = accomData;
        } else if (accomData && Array.isArray(accomData.data)) {
          accommodationsList = accomData.data;
        }

        console.log('Total accommodations:', accommodationsList.length);

        // Fetch images for each accommodation from Unsplash
        console.log('Fetching images from Unsplash...');
        const accommodationsWithImages = await Promise.all(
          accommodationsList.map(async (accom: any) => {
            console.log(`Fetching image for: ${accom.name} (${accom.city}, ${accom.country})`);
            const images = await getHotelImages(accom.city, accom.country);
            return {
              ...accom,
              image: images.length > 0 ? images[0] : hotel,
            };
          })
        );

        console.log('✅ Accommodations with images:', accommodationsWithImages.length);
        setAccommodations(accommodationsWithImages);
        setFilteredAccommodations(accommodationsWithImages);
        
        saveAccommodationsToCache(accommodationsWithImages);

        if (isAuthenticated) {
          console.log('Loading favorites...');
          const favData = await getFavorites();
          const favIds = new Set<string>(favData.data.map((fav: any) => fav.id as string));
          setFavorites(favIds);
          console.log('✅ Favorites loaded:', favIds.size);
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
    
    let filtered = accommodations;

    if (filters.city) {
      filtered = filtered.filter(accom => 
        accom.city.toLowerCase().includes(filters.city.toLowerCase()) ||
        accom.country.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.guests) {
      const guests = parseInt(filters.guests);
      filtered = filtered.filter(accom => accom.max_capacity >= guests);
    }

    setFilteredAccommodations(filtered);
  };

  const toggleFavorite = async (accommodationId: string) => {
    if (!isAuthenticated) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(accommodationId);
    try {
      if (favorites.has(accommodationId)) {
        await removeFavorite(accommodationId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(accommodationId);
          return newSet;
        });
      } else {
        await addFavorite(accommodationId);
        setFavorites(prev => new Set(prev).add(accommodationId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite");
    } finally {
      setLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center px-5 pt-5">
        <Link to="/">
          <Button variant="primary" className="flex gap-2">
            <FaArrowLeft className="mt-1" />Back
          </Button>
        </Link>
        <Link to="/profile" className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <FaUser className="text-blue-600 text-xl" />
        </Link>
      </div>

      {/* RESULTS IN 4x3 GRID */}
      <div className="w-full flex justify-center px-4 pb-12 mt-8">
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">
            {filteredAccommodations.length} of {accommodations.length} Results
          </h2>

          {filteredAccommodations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No accommodations found matching your criteria.</p>
              <Button variant="secondary" onClick={() => {
                setFilters({ city: "", checkIn: "", checkOut: "", guests: "2", rooms: "1" });
                setFilteredAccommodations(accommodations);
              }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAccommodations.map((accom) => {
                const isFavorited = favorites.has(accom.id);
                const isLoadingThis = loading === accom.id;

                return (
                  <div key={accom.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Hotel Image */}
                    <div className="relative h-48">
                      <img 
                        src={accom.image} 
                        alt={accom.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = hotel;
                        }}
                      />
                      {/* Favorite Heart */}
                      <button 
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => toggleFavorite(accom.id)}
                        disabled={isLoadingThis}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition disabled:opacity-50"
                      >
                        {isFavorited ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-700 text-lg" />
                        )}
                      </button>
                    </div>

                    {/* Card Content with Location on Right */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        {/* Left side: Name, Location, Rating */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-2 line-clamp-1">{accom.name}</h3>
                          
                          {/* Location */}
                          <div className="flex items-center gap-2 mb-2">
                            <FaLocationDot className="text-blue-500 text-sm flex-shrink-0" />
                            <span className="text-sm text-gray-600 line-clamp-1">{accom.city}, {accom.country}</span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(accom.star_rating)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">({accom.star_rating} stars)</span>
                          </div>
                        </div>

                        {/* Right side: Map Location Link */}
                        <a 
                          href={`https://www.google.com/maps?q=${accom.latitude},${accom.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 rounded-lg p-3 transition-colors"
                          title="View on Google Maps"
                        >
                          <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                          <div className="text-xs text-gray-600 mt-1 text-center">Map</div>
                        </a>
                      </div>

                      {/* Address */}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{accom.address}</p>
                      
                      {/* Price and Button */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-lg font-bold text-blue-600">
                            {accom.min_price > 0 ? `R ${accom.min_price}` : 'Check availability'}
                            <span className="text-xs text-gray-500"> / night</span>
                          </p>
                        </div>
                        <Link to={`/booking?accommodation=${accom.id}`}>
                          <Button variant="primary" className="text-sm py-2 px-4">Book</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};