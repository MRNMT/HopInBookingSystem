import { db } from '../config/db';
import { PaymentStatus, Payment } from '../../common/types/types';
import { AppError } from '../middleware/error.handler';



export class PaymentService {
  public async getMyPayments(userId: string): Promise<Payment[]> {
    const query = `
      SELECT * FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  public async getById(paymentId: string, userId: string, isAdmin: boolean): Promise<Payment> {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await db.query(query, [paymentId]);

    if (result.rows.length === 0) {
      throw new AppError(404, 'Payment not found.');
    }

    const payment = result.rows[0];

    if (!isAdmin && payment.user_id !== userId) {
      throw new AppError(403, 'Access denied.');
    }

    return payment;
  }

  public async getAllAdmin(status?: string): Promise<Payment[]> {
    let query = 'SELECT * FROM payments';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }
}
