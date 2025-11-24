import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db'; // Use the db helper for queries
import { User, UserRole } from '../common/types/types'; // Correct import path
import { AppError } from './error.handler';

interface TokenPayload {
  id: string;
  role: UserRole;
  email: string;
}

/**
 * Middleware to verify the JWT token and ensure the user exists in the DB.
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract Token
  const authHeader = req.headers['authorization'];
  // Supports "Bearer <token>" format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'Access token required.'));
  }
  try {
    // 2. Verify Token Signature
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL: JWT_SECRET is not defined.');
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;

    // 3. Verify User Exists in Database (Security Check)
    // We fetch the user to ensure they haven't been deleted since the token was issued.
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [decoded.id]);

    if (result.rows.length === 0) {
      return next(new AppError(401, 'User not found or deactivated.'));
    }

    // 4. Attach User to Request
    // This works because we extended the Express Request type in src/types/express.d.ts
    // Map DB user row to User interface, replace 'customer' role with 'user' to align with typing
    const dbUser = result.rows[0];
    const mappedUser: User = {
      ...dbUser,
      role: dbUser.role === 'customer' ? 'user' : dbUser.role,
    };
    req.user = mappedUser;

    next();
  } catch (error) {
    // jwt.verify throws an error if the token is invalid or expired
    return next(new AppError(403, 'Invalid or expired token.'));
  }
};

/**
 * Middleware to restrict access to Admins only.
 */
export const isAdminOrSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Requires isAuthenticated to run first
  if (!req.user) {
    return next(new AppError(401, 'Authentication required.'));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new AppError(403, 'Admin access required.'));
  }

  next();
};