import { Request, Response } from 'express';
import { db } from '../config/db';

// Simple in-memory cache
let accommodationsCache: { data: any[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all accommodations
export const getAllAccommodations = async (req: Request, res: Response) => {
    try {
        // Check cache
        if (accommodationsCache && (Date.now() - accommodationsCache.timestamp < CACHE_DURATION)) {
            console.log('⚡ Serving accommodations from cache');
            return res.json({ data: accommodationsCache.data, success: true });
        }

        const result = await db.query(
            `SELECT * FROM accommodations 
       WHERE is_active = true 
       ORDER BY created_at DESC`
        );

        // Update cache
        accommodationsCache = {
            data: result.rows,
            timestamp: Date.now()
        };
        console.log('💾 Caching accommodations data');

        res.json({ data: result.rows, success: true });
    } catch (error) {
        console.error('Error getting accommodations:', error);
        res.status(500).json({ message: 'Failed to get accommodations' });
    }
};

// Get accommodation by ID
export const getAccommodationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM accommodations WHERE id = $1 AND is_active = true',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

        res.json({ data: result.rows[0], success: true });
    } catch (error) {
        console.error('Error getting accommodation:', error);
        res.status(500).json({ message: 'Failed to get accommodation' });
    }
};

// Search accommodations
export const searchAccommodations = async (req: Request, res: Response) => {
    try {
        const { city, country, checkIn, checkOut, guests, rooms } = req.query;

        let query = 'SELECT * FROM accommodations WHERE is_active = true';
        const params: any[] = [];
        let paramCount = 1;

        if (city) {
            query += ` AND LOWER(city) = LOWER($${paramCount})`;
            params.push(city);
            paramCount++;
        }

        if (country) {
            query += ` AND LOWER(country) = LOWER($${paramCount})`;
            params.push(country);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);

        res.json({ data: result.rows, success: true });
    } catch (error) {
        console.error('Error searching accommodations:', error);
        res.status(500).json({ message: 'Failed to search accommodations' });
    }
};

// Get room types for accommodation
export const getRoomTypes = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT * FROM room_types 
       WHERE accommodation_id = $1 AND is_available = true
       ORDER BY price_per_night ASC`,
            [id]
        );

        res.json({ data: result.rows, success: true });
    } catch (error) {
        console.error('Error getting room types:', error);
        res.status(500).json({ message: 'Failed to get room types' });
    }
};
