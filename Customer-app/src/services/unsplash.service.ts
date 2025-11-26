import axios from 'axios';

// Unsplash API configuration
// Get your API keys from: https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_unsplashAccessKey || '';
const UNSPLASH_SECRET_KEY = import.meta.env.VITE_unsplashSecretKey || '';
const UNSPLASH_APP_ID = import.meta.env.VITE_AppId || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

interface UnsplashPhoto {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
}

/**
 * Search for hotel/accommodation images on Unsplash
 * @param query - Search query (e.g., "luxury hotel paris", "resort tokyo")
 * @param perPage - Number of results to return (default: 10)
 */
export const searchUnsplashPhotos = async (query: string, perPage: number = 10): Promise<string[]> => {
    try {
        if (!UNSPLASH_ACCESS_KEY) {
            console.warn('⚠️ Unsplash Access Key not found. Please add VITE_unsplashAccessKey to your .env file');
            return [];
        }

        console.log(`🔍 Searching Unsplash for: "${query}"`);

        const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
            params: {
                query,
                per_page: perPage,
                orientation: 'landscape',
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        const photos: UnsplashPhoto[] = response.data.results;
        console.log(`✅ Found ${photos.length} images for "${query}"`);

        return photos.map(photo => photo.urls.regular);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.error('❌ Unsplash API: Unauthorized. Please check your Access Key.');
            } else if (error.response?.status === 403) {
                console.error('❌ Unsplash API: Rate limit exceeded. Try again later.');
            } else {
                console.error('❌ Unsplash API Error:', error.response?.data || error.message);
            }
        } else {
            console.error('❌ Error fetching Unsplash photos:', error);
        }
        return [];
    }
};

/**
 * Get hotel images based on location
 * Uses location-specific search queries for better results
 */
export const getHotelImages = async (city: string, country: string): Promise<string[]> => {
    // Create location-specific search queries
    const queries = [
        `luxury hotel ${city} ${country}`,
        `${city} hotel interior`,
        `${city} accommodation`,
    ];

    try {
        // Try the first query
        const images = await searchUnsplashPhotos(queries[0], 5);

        if (images.length > 0) {
            return images;
        }

        // Fallback to second query if first returns no results
        console.log(`⚠️ No results for "${queries[0]}", trying: "${queries[1]}"`);
        return await searchUnsplashPhotos(queries[1], 5);
    } catch (error) {
        console.error(`❌ Error fetching images for ${city}, ${country}:`, error);
        return [];
    }
};

/**
 * Get a single random hotel image for a location
 */
export const getRandomHotelImage = async (city: string, country: string): Promise<string | null> => {
    const images = await getHotelImages(city, country);
    return images.length > 0 ? images[0] : null;
};

// Export configuration for debugging
export const getUnsplashConfig = () => ({
    hasAccessKey: !!UNSPLASH_ACCESS_KEY,
    hasSecretKey: !!UNSPLASH_SECRET_KEY,
    hasAppId: !!UNSPLASH_APP_ID,
    apiUrl: UNSPLASH_API_URL,
});
