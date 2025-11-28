import { Request, Response, NextFunction } from 'express';
import { SuperAdminService } from '../services/superadmin.service'; // 1. Import the Class
import { RegisterDto } from '../common/types/types';

// 2. INSTANTIATE the Class (This was missing or done incorrectly)
const superAdminService = new SuperAdminService();

/**
 * Creates a new Admin user.
 * POST /api/v1/superadmin/admins
 */
export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminData: RegisterDto = req.body;

        // 3. Call methods on the INSTANCE
        const newAdmin = await superAdminService.createAdmin(adminData);

        res.status(201).json({
            message: 'Admin account created successfully',
            data: newAdmin
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Gets a list of all admin users.
 * GET /api/v1/superadmin/admins
 */
export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await superAdminService.getAllAdmins();

        res.status(200).json({
            message: 'Admin list retrieved successfully',
            data: admins
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Gets a specific admin by ID.
 * GET /api/v1/superadmin/admins/:id
 */
export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const admin = await superAdminService.getAdminById(id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            message: 'Admin details retrieved',
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes an admin.
 * DELETE /api/v1/superadmin/admins/:id
 */
export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleted = await superAdminService.deleteAdmin(id);

        if (!deleted) {
            return res.status(404).json({ message: "Admin not found or could not be deleted" });
        }

        res.status(200).json({
            message: 'Admin deleted successfully',
            data: deleted
        });
    } catch (error) {
        next(error);
    }
};