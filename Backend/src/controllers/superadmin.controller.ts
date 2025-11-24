import { Response, Request } from "express";
import * as superAdminService from '../services/superadmin.service'
import { RegisterDto } from "../../common/types/types";

export const createAdmin = async (req: Request, res: Response) => {
    
    const data: RegisterDto = req.body

    try{
        const created = await superAdminService.createAdmin(data)
        res.status(201).json(data)
    }catch(error){
        console.log("Error in creading an admin", error)
        res.status(400).json({message: "Something went wrong"})
    }
}

export const getAllAdmins = async (req: Request, res: Response) => {
    
    const data: RegisterDto = req.body

    try{
        const admins = await superAdminService.getAllAdmins()
        res.status(200).json(admins)
    }catch(error){
        console.log("Error in error in fetching admins", error)
        res.status(404).json({message: "NO admins where found"})
        res.status(500).json({message: "unexpected error on our end"})
    }
}

export const getAdminById = async (req: Request, res: Response) => {
    
    const id = req.params.id

    try{
        const admin = await superAdminService.getAdminById(id)
        res.status(200).json(admin)
    }catch(error){
        console.log("Error in getting admin", error)
        res.status(404).json({message: "User not found"})
    }
}

export const deleteAdmin = async (res: Response, req: Request) => {

    const id = req.params.id

    try{
        const admin = await superAdminService.deleteAdmin(id)
        res.status(200).json(admin)
    }catch(error){
        console.log("Error in deleting admin", error)
        res.status(404).json({message: "The admin could not be found, therefore delete was unsuccessful"})
    }
}
