import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../components/Button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import hotel1 from "../assets/hotel1.jpg";
import { useState, useEffect } from "react";
import { addFavorite, removeFavorite, getFavorites } from "../services/favorites.service";
import { getAllAccommodations } from "../services/accommodation.service";
import { getHotelImages } from "../services/unsplash.service";
import { getAccommodationsFromCache } from "../utils/accommodationCache";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";

interface AccommodationWithImage {
  id: string;
  name: string;
  city: string;
  country: string;
  star_rating: number;
  image: string;
}

export const FeaturedHotels = () => {
  const [accommodations, setAccommodations] = useState<AccommodationWithImage[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading accommodations...');
        
        // Check localStorage first
        const cachedAccommodations = getAccommodationsFromCache();
        let accommodationsList: any[] = [];

        if (cachedAccommodations && cachedAccommodations.length > 0) {
          console.log('Using cached accommodations from localStorage');
          accommodationsList = cachedAccommodations;
        } else {
          // Fetch from API if no cache
          console.log('Fetching accommodations from API...');
          const accomData = await getAllAccommodations();
          console.log('API response:', accomData);

          // Parse response
          if (Array.isArray(accomData)) {
            accommodationsList = accomData;
          } else if (accomData && Array.isArray(accomData.data)) {
            accommodationsList = accomData.data;
          } else if (accomData && accomData.accommodations) {
            accommodationsList = accomData.accommodations;
          } else {
            console.error('Unexpected response structure:', accomData);
          }
        }

        console.log('Accommodations count:', accommodationsList.length);

        if (accommodationsList.length === 0) {
          console.warn('No accommodations found');
          setIsLoading(false);
          return;
        }

        const topAccommodations = accommodationsList.slice(0, 3); // Show first 3
        console.log('Top 3 accommodations:', topAccommodations);

        console.log('Fetching images from Lummi...');
        const accommodationsWithImages = await Promise.all(
          topAccommodations.map(async (accom: any) => {
            if (accom.image && accom.image.startsWith('http')) {
               return accom;
            }
            
            console.log(`Fetching image for: ${accom.name} (${accom.city}, ${accom.country})`);
            const images = await getHotelImages(accom.city, accom.country);
            return {
              ...accom,
              image: images.length > 0 ? images[0] : hotel1, 
            };
          })
        );

        console.log('Accommodations with images:', accommodationsWithImages);
        setAccommodations(accommodationsWithImages);

        if (isAuthenticated) {
          console.log('Loading favorites...');
          const favData = await getFavorites();
          const favIds = new Set<string>(favData.data.map((fav: any) => fav.id as string));
          setFavorites(favIds);
          console.log('Favorites loaded:', favIds.size);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

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
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading luxury accommodations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (accommodations.length === 0) {
    return (
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">
            <p>No accommodations available at the moment.</p>
            <p className="text-sm mt-2">Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Hotels</h1>
          <Link to="/find">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
              View All <FaArrowRight />
            </button>
          </Link>
        </div>

        <p className="text-gray-600 mb-12">Hand-picked luxury accommodations for you</p>

        {/* HOTEL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {accommodations.map((item) => {
            const isFavorited = favorites.has(item.id);
            const isLoadingThis = loading === item.id;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">

                {/* IMAGE + BADGE + HEART */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={`${item.name} in ${item.city}`}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = hotel1;
                    }}
                  />

                  {/* featured badge */}
                  <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-md font-medium">
                    featured
                  </span>

                  {/* Favorite Heart */}
                  <button 
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    onClick={() => toggleFavorite(item.id)}
                    disabled={isLoadingThis}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow font-bold hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    {isFavorited ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-gray-700 text-lg" />
                    )}
                  </button>
                </div>

                {/* CARD CONTENT */}
                <div className="p-6">

                  {/* NAME */}
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>

                  {/* LOCATION */}
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaLocationDot className="text-blue-500" />
                    <span>{item.city}, {item.country}</span>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.star_rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                    <span className="text-gray-500 text-sm ml-1">({item.star_rating} stars)</span>
                  </div>

                  {/* PRICE SECTION */}
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">starting from</p>
                    <p className="text-lg font-semibold">
                      <span className="text-blue-600">R 580</span> / night
                    </p>
                  </div>

                  {/* BUTTON */}
                  <Link to={`/booking?accommodation=${item.id}`}>
                    <Button variant="primary" className="w-full">Book Now</Button>
                  </Link>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};