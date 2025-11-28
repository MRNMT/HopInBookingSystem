import { Request, Response } from 'express';
import { AccommodationService } from '../services/accommodation.service';

const accommodationService = new AccommodationService();

// Get all accommodations
export const getAllAccommodations = async (req: Request, res: Response) => {
    try {
        const accommodations = await accommodationService.getAll();
        res.json({ data: accommodations, success: true });
    } catch (error) {
        console.error('Error getting accommodations:', error);
        res.status(500).json({ message: 'Failed to get accommodations' });
    }
};

// Get accommodation by ID
export const getAccommodationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const accommodation = await accommodationService.getById(id);

        if (!accommodation) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

        res.json({ data: accommodation, success: true });
    } catch (error) {
        console.error('Error getting accommodation:', error);
        res.status(500).json({ message: 'Failed to get accommodation' });
    }
};

// Search accommodations
export const searchAccommodations = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const accommodations = await accommodationService.search(filters);
        res.json({ data: accommodations, success: true });
    } catch (error) {
        console.error('Error searching accommodations:', error);
        res.status(500).json({ message: 'Failed to search accommodations' });
    }
};

// Get room types for accommodation
// Note: This might still need to be in the controller if it's not in the service, 
// but looking at the service file, it doesn't seem to have getRoomTypes. 
// Let's keep the raw query for now or move it to service if needed.
// For now, I'll keep the raw query for room types as it wasn't the issue.
import { db } from '../config/db';

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
