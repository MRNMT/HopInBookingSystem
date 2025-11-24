import {Request, Response, NextFunction} from 'express'
import { AccommodationService } from '../services/accommodation.service';
import { BookingService } from '../services/booking.service';
import { ReviewService } from '../services/review.service';
import { AdminService } from '../services/admin.service';
import { AppError } from '../middleware/error.handler';

const accommodationService = new AccommodationService();
const bookingService = new BookingService();
const reviewService = new ReviewService();
const adminService = new AdminService();

export const getDashboardStats = async (req: Request , res:Response , next: NextFunction) =>{
    try{
        const stats = await adminService.getDashboardStats();
        res.status(200).json({mesage:'Dashboard stats recieved',data: stats})
    }catch(error){
        next(error);
    }
}
//get all users
export const getAllUsers = async (req:Request, res: Response, next: NextFunction) =>{
    try{
        const allUsers = await adminService.getAllUsers();
        res.status(200).json({message:'All users fetched', data: allUsers})
    }catch(error){
        next(error);
    }
}
//create accomodation
export const createAccomodation = async (req:Request, res: Response , next: NextFunction) =>{
    try{
        if (!req.user?.id) return next(new AppError(401, 'Authentication required'));
        const result = await accommodationService.create(req.body, req.user.id);
        res.status(200).json({message: 'Accomodation created successfully', data: result})
    }catch(error){
        next(error)
    }
}
//update accomodation

export const updateAccomodation = async (req:Request, res: Response, next: NextFunction) => {
    try{
        const updates = await accommodationService.update(req.params.id, req.body);
        res.status(200).json({message: 'Accomodation updated successfully', data: updates})
    }catch(error){
        next(error)
    }
}
//delete an accomodation
//get all accomodations 
//get all bookings
//update bookings
//get reviews
//approve reviews
//delete a review