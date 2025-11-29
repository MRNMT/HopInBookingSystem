import { Button } from "../components/Button";
import { FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaMapMarkerAlt, FaUser, FaSearch, FaCalendar, FaUsers, FaBed, FaTimes } from "react-icons/fa";
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
    searchTerm: "",
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
    minRating: "",
    priceRange: ""
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [accommodations, setAccommodations] = useState<AccommodationWithImage[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<AccommodationWithImage[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Extract unique cities from accommodations
  const uniqueCities = Array.from(new Set(accommodations.map(a => a.city))).sort();

  useEffect(() => {
    const loadData = async () => {
      try {
        //console.log('Loading accommodations...');
        
        const cachedAccommodations = getAccommodationsFromCache();
        
        if (cachedAccommodations && cachedAccommodations.length > 0) {
          const hasImages = cachedAccommodations[0].image && cachedAccommodations[0].image.startsWith('http');
          
          if (hasImages) {
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

        const accommodationsWithImages = await Promise.all(
          accommodationsList.map(async (accom: any) => {
            const images = await getHotelImages(accom.city, accom.country);
            return {
              ...accom,
              image: images.length > 0 ? images[0] : hotel,
            };
          })
        );

        //console.log(' Accommodations with images:', accommodationsWithImages.length);
        setAccommodations(accommodationsWithImages);
        setFilteredAccommodations(accommodationsWithImages);
        
        saveAccommodationsToCache(accommodationsWithImages);

        if (isAuthenticated) {
          //console.log('Loading favorites...');
          const favData = await getFavorites();
          const favIds = new Set<string>(favData.data.map((fav: any) => fav.id as string));
          setFavorites(favIds);
          //console.log(' Favorites loaded:', favIds.size);
        }
      } catch (error) {
        //console.error(" Error loading data:", error);
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

    // Text search (name, city, country, address)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(accom => 
        accom.name.toLowerCase().includes(searchLower) ||
        accom.city.toLowerCase().includes(searchLower) ||
        accom.country.toLowerCase().includes(searchLower) ||
        accom.address.toLowerCase().includes(searchLower)
      );
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(accom => accom.city === filters.city);
    }

    // Guests capacity filter
    if (filters.guests) {
      const guests = parseInt(filters.guests);
      filtered = filtered.filter(accom => accom.max_capacity >= guests);
    }

    // Star rating filter
    if (filters.minRating) {
      const minRating = parseInt(filters.minRating);
      filtered = filtered.filter(accom => accom.star_rating >= minRating);
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === "5000+") {
        filtered = filtered.filter(accom => accom.min_price >= 5000);
      } else {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filtered = filtered.filter(accom => 
          accom.min_price >= min && accom.min_price <= max
        );
      }
    }

    setFilteredAccommodations(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      city: "",
      checkIn: "",
      checkOut: "",
      guests: "2",
      rooms: "1",
      minRating: "",
      priceRange: ""
    });
    setFilteredAccommodations(accommodations);
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

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== "2" && value !== "1" && key !== 'searchTerm'
  ).length;

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
      {/* Header */}
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

      {/* SEARCH & FILTER SECTION */}
      <div className="w-full flex justify-center px-4 mt-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by name or location
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Hotel name, city, or country..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* City Dropdown */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-1" />
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div className="lg:w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-1" />
                  Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  value={filters.guests}
                  onChange={handleFilterChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
              >
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                <span className={`transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {activeFiltersCount > 0 && (
                <span className="text-sm text-gray-600">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={filters.checkIn}
                    onChange={handleFilterChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={filters.checkOut}
                    onChange={handleFilterChange}
                    min={filters.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBed className="inline mr-1" />
                    Rooms
                  </label>
                  <select
                    name="rooms"
                    value={filters.rooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaStar className="inline mr-1 text-yellow-400" />
                    Min Rating
                  </label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per night)
                  </label>
                  <select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Price</option>
                    <option value="0-500">R 0 - R 500</option>
                    <option value="500-1000">R 500 - R 1,000</option>
                    <option value="1000-2000">R 1,000 - R 2,000</option>
                    <option value="2000-5000">R 2,000 - R 5,000</option>
                    <option value="5000+">R 5,000+</option>
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaSearch />
                Search Accommodations
              </button>
              
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="w-full flex justify-center px-4 pb-12">
        <div className="w-full max-w-7xl">

          {filteredAccommodations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No accommodations found matching your criteria.</p>
              <Button variant="secondary" onClick={handleClearFilters} className="mt-4">
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

                    {/* Card Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-2 line-clamp-1">{accom.name}</h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <FaLocationDot className="text-blue-500 text-sm flex-shrink-0" />
                            <span className="text-sm text-gray-600 line-clamp-1">{accom.city}, {accom.country}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {[...Array(accom.star_rating)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">({accom.star_rating} stars)</span>
                          </div>
                        </div>

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

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{accom.address}</p>
                      
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