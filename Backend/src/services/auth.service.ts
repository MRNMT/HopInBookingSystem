import { RegisterDto, LoginDto, User, UserRole } from '../common/types/types';
import { db } from '../config/db'; 
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/error.handler';

export class AuthService {

  public async register(dto: RegisterDto): Promise<{ user: User, token: string }> {
    const { email, password, fullName } = dto;

    if (email.endsWith('@hopinAdmin.email') || email.endsWith('@hopinSuperAdmin.email')) {
      throw new AppError(400, 'Cannot register using a reserved admin email domain.');
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError(409, 'User already exists.');
    }

    if (!password) {
      throw new AppError(400, 'Password is required for registration.');
    }
    const hashedPassword = await hashPassword(password);

    const result = await db.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
      [email, hashedPassword, fullName, 'customer']
    );

    const user: User = result.rows[0];

    const token = generateToken({ id: user.id, email: user.email, role: user.role as UserRole });

    return { user, token };
  }

  public async login(dto: LoginDto): Promise<{ user: User, token: string }> {
    const { email, password } = dto;

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      throw new AppError(400, 'Please log in using the method you signed up with.');
    }

    if (!password) {
      throw new AppError(400, 'Password is required.');
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    });

    delete user.password_hash;
    delete user.oauth_provider;
    delete user.oauth_id;

    return { user: user as User, token };
  }

  public async logout(userId: string): Promise<void> {
    return;
  }

  public async getMe(userId: string): Promise<User> {
    const result = await db.query(
      'SELECT id, full_name, email, role, profile_image_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found.');
    }

    return result.rows[0] as User;
  }

}
