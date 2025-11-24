import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { AppError } from '../middleware/error.handler';

const paymentService = new PaymentService();

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const payments = await paymentService.getMyPayments(req.user.id);

    res.status(200).json({ 
      message: 'Payment history retrieved', 
      data: payments 
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const paymentId = req.params.id;
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    const payment = await paymentService.getById(paymentId, req.user.id, isAdmin);

    res.status(200).json({ 
      message: 'Payment details retrieved', 
      data: payment 
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPaymentsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string;
    const payments = await paymentService.getAllAdmin(status);

    res.status(200).json({ 
      message: 'All system payments retrieved', 
      data: payments 
    });
  } catch (error) {
    next(error);
  }
};
