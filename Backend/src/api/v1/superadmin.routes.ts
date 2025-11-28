import { Router } from "express";
import * as superAdminController from '../../controllers/superadmin.controller'
import { isAuthenticated, isSuperAdmin } from '../../middleware/auth.middleware';

const superAdminRoute = Router()

// Create admin
superAdminRoute.post('/', isAuthenticated, isSuperAdmin, superAdminController.createAdmin)
// Read admins
superAdminRoute.get('/', isAuthenticated, isSuperAdmin, superAdminController.getAllAdmins)
superAdminRoute.get('/:id', isAuthenticated, isSuperAdmin, superAdminController.getAdminById)
// Delete admin
superAdminRoute.delete('/:id', isAuthenticated, isSuperAdmin, superAdminController.deleteAdmin)

export default superAdminRoute