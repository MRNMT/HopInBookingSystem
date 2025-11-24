import { Router } from "express";
import * as superAdminController from '../../controllers/superadmin.controller'

const superAdminRoute = Router()

//create
superAdminRoute.post('/', superAdminController.createAdmin)
//read
superAdminRoute.get('/', superAdminController.getAllAdmins)
superAdminRoute.get('/:id', superAdminController.getAdminById)
//delete
superAdminRoute.delete('/:id', superAdminController.deleteAdmin)

export default superAdminRoute