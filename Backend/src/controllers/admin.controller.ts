import { Request, Response, NextFunction } from 'express'
import { AccommodationService } from '../services/accommodation.service';
import { BookingService } from '../services/booking.service';
import { ReviewService } from '../services/review.service';
import { AdminService } from '../services/admin.service';
import { AppError } from '../middleware/error.handler';
import { constants } from 'http2';

const accommodationService = new AccommodationService();
const bookingService = new BookingService();
const reviewService = new ReviewService();
const adminService = new AdminService();

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ mesage: 'Dashboard stats recieved', data: stats })
    } catch (error) {
        next(error);
    }
}
//get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await adminService.getAllUsers();
        res.status(200).json({ message: 'All users fetched', data: allUsers })
    } catch (error) {
        next(error);
    }
}
// Get location performance
export const getLocationPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const locationData = await adminService.getLocationPerformance();
        res.status(200).json({ message: 'Location performance fetched', data: locationData });
    } catch (error) {
        next(error);
    }
}
//create accomodation
export const createAccomodation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) return next(new AppError(401, 'Authentication required'));
        const result = await accommodationService.create(req.body, req.user.id);
        res.status(200).json({ message: 'Accomodation created successfully', data: result })
    } catch (error) {
        next(error)
    }
}
//update accomodation
export const updateAccomodation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updates = await accommodationService.update(req.params.id, req.body);
        res.status(200).json({ message: 'Accomodation updated successfully', data: updates })
    } catch (error) {
        next(error)
    }
}
//delete an accomodation
export const deleteAccomodation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await accommodationService.delete(req.params.id);
        res.status(200).json({ message: 'Accomodation successfully deleted', data: deleted });
    } catch (error) {
        next(error)
    }
}
//get all accomodations 
export const getAccomodations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accomodations = await accommodationService.getAll();
        res.status(200).json({ message: 'Fetched all accomodations', data: accomodations })
    } catch (error) {
        next(error)
    }
}
//get bookings
export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await bookingService.getAllBookings()
        res.status(200).json({ message: 'fetched all bookings', data: bookings })
    } catch (error) {
        next(error)
    }
}

//update bookings
export const updateBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedBookings = await bookingService.updateAdmin(req.params.id, req.body);
        res.status(200).json({ message: 'Updated admin', data: updatedBookings })
    }
    catch (error) {
        next(error)
    }
}
//get reviews
export const getAllPendingReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allReviews = await reviewService.getPending();
        res.status(200).json({ message: 'Fetched all pending reviews', data: allReviews })
    } catch (error) {
        next(error);
    }
}
//approve reviews
export const approveReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const approveAReview = await reviewService.approve(req.params.id);
        res.status(200).json({ message: 'Review approved', data: approveAReview })
    }
    catch (error) {
        next(error);
    }
}
//delete a review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedReview = await reviewService.delete(req.params.id);
        res.status(200).json({ message: 'Review deleted', data: deletedReview });
    } catch (error) {
        next(error)
    }
}