// LocalStorage key constants
const ACCOMMODATIONS_KEY = 'hopin_accommodations';
const ACCOMMODATIONS_TIMESTAMP_KEY = 'hopin_accommodations_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface AccommodationCache {
    data: any[];
    timestamp: number;
}

/**
 * Save accommodations to localStorage
 */
export const saveAccommodationsToCache = (accommodations: any[]): void => {
    try {
        const cache: AccommodationCache = {
            data: accommodations,
            timestamp: Date.now(),
        };
        localStorage.setItem(ACCOMMODATIONS_KEY, JSON.stringify(cache));
        console.log('💾 Accommodations saved to localStorage');
    } catch (error) {
        console.error('Error saving accommodations to localStorage:', error);
    }
};

/**
 * Get accommodations from localStorage if valid
 */
export const getAccommodationsFromCache = (): any[] | null => {
    try {
        const cached = localStorage.getItem(ACCOMMODATIONS_KEY);
        if (!cached) {
            console.log('📭 No cached accommodations found');
            return null;
        }

        const cache: AccommodationCache = JSON.parse(cached);
        const now = Date.now();
        const age = now - cache.timestamp;

        if (age > CACHE_DURATION) {
            console.log('⏰ Cached accommodations expired');
            clearAccommodationsCache();
            return null;
        }

        console.log(` Retrieved ${cache.data.length} accommodations from cache (age: ${Math.round(age / 1000)}s)`);
        return cache.data;
    } catch (error) {
        console.error('Error reading accommodations from localStorage:', error);
        return null;
    }
};

/**
 * Clear accommodations cache
 */
export const clearAccommodationsCache = (): void => {
    try {
        localStorage.removeItem(ACCOMMODATIONS_KEY);
        localStorage.removeItem(ACCOMMODATIONS_TIMESTAMP_KEY);
        console.log('🗑️ Accommodations cache cleared');
    } catch (error) {
        console.error('Error clearing accommodations cache:', error);
    }
};

/**
 * Check if accommodations cache is valid
 */
export const isCacheValid = (): boolean => {
    try {
        const cached = localStorage.getItem(ACCOMMODATIONS_KEY);
        if (!cached) return false;

        const cache: AccommodationCache = JSON.parse(cached);
        const age = Date.now() - cache.timestamp;
        return age <= CACHE_DURATION;
    } catch (error) {
        return false;
    }
};
