import axios from 'axios';

const LUMMI_API_KEY = 'lummi-960d4d13bae2b6315abaca2663c6fbbe96644220fe42ca03332123958e89f3f3';
const LUMMI_BASE_URL = 'https://api.lummi.ai/v1';

interface LummiImage {
    id: string;
    url: string;
    thumbnail: string;
    width: number;
    height: number;
    alt: string;
}

export const searchImages = async (query: string, limit: number = 5): Promise<LummiImage[]> => {
    try {
        const response = await axios.get(`${LUMMI_BASE_URL}/search`, {
            params: {
                query,
                limit,
            },
            headers: {
                'Authorization': `Bearer ${LUMMI_API_KEY}`,
            },
        });

        return response.data.images || [];
    } catch (error) {
        console.error('Error fetching images from Lummi:', error);
        return [];
    }
};

export const getHotelImages = async (city: string, country: string): Promise<string[]> => {
    try {
        // Create specific search queries for different locations to ensure variety
        let query = `luxury hotel ${city} ${country}`;

        // Add specific keywords based on location to simulate "collections"
        if (city.toLowerCase().includes('paris')) query += ' eiffel tower view';
        else if (city.toLowerCase().includes('tokyo')) query += ' modern japanese';
        else if (city.toLowerCase().includes('cape town')) query += ' ocean view';
        else if (city.toLowerCase().includes('johannesburg')) query += ' urban luxury';
        else if (city.toLowerCase().includes('durban')) query += ' beach resort';
        else if (city.toLowerCase().includes('moscow')) query += ' historic architecture';
        else if (city.toLowerCase().includes('sydney')) query += ' harbour view';
        else if (city.toLowerCase().includes('polokwane')) query += ' garden retreat';
        else if (city.toLowerCase().includes('mbombela')) query += ' safari lodge style';
        else query += ' interior design';

        const images = await searchImages(query, 5);
        return images.map(img => img.url);
    } catch (error) {
        console.error('Error getting hotel images:', error);
        return [];
    }
};
