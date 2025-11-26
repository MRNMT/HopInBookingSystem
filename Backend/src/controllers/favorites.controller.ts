import { Request, Response } from 'express';
import { db } from '../config/db';

// Add favorite
export const addFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { accommodation_id } = req.body;

        if (!accommodation_id) {
            return res.status(400).json({ message: 'Accommodation ID is required' });
        }

        // Check if already favorited
        const existing = await db.query(
            'SELECT * FROM user_favorites WHERE user_id = $1 AND accommodation_id = $2',
            [userId, accommodation_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Already in favorites' });
        }

        await db.query(
            'INSERT INTO user_favorites (user_id, accommodation_id) VALUES ($1, $2)',
            [userId, accommodation_id]
        );

        res.status(201).json({ message: 'Added to favorites', success: true });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Failed to add favorite' });
    }
};

// Remove favorite
export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { accommodationId } = req.params;

        await db.query(
            'DELETE FROM user_favorites WHERE user_id = $1 AND accommodation_id = $2',
            [userId, accommodationId]
        );

        res.json({ message: 'Removed from favorites', success: true });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Failed to remove favorite' });
    }
};

// Get user's favorites
export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const result = await db.query(
            `SELECT a.*, uf.created_at as favorited_at
       FROM user_favorites uf
       JOIN accommodations a ON uf.accommodation_id = a.id
       WHERE uf.user_id = $1 AND a.is_active = true
       ORDER BY uf.created_at DESC`,
            [userId]
        );

        res.json({ data: result.rows, success: true });
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ message: 'Failed to get favorites' });
    }
};

// Check if accommodation is favorited
export const checkFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { accommodationId } = req.params;

        const result = await db.query(
            'SELECT * FROM user_favorites WHERE user_id = $1 AND accommodation_id = $2',
            [userId, accommodationId]
        );

        res.json({ isFavorite: result.rows.length > 0, success: true });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ message: 'Failed to check favorite' });
    }
};
