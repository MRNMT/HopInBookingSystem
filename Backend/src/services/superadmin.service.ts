import { db } from "../config/db";
import { User, RegisterDto } from "../common/types/types";
import { AppError } from "../middleware/error.handler";
import { hashPassword } from "../utils/password.utils";
import { QueryResult } from "pg";

export class SuperAdminService {

    /**
     * Creates a new Admin account.
     * Enforces strict email domain rules.
     */
    public async createAdmin(data: RegisterDto): Promise<User> {
        const { email, password, fullName } = data;

        // 1. Enforce Domain Security Rule
        if (!email.endsWith("@hopinAdmin.email")) {
            throw new AppError(400, "Admin accounts must use the @hopinAdmin.email domain.");
        }

        // 2. Check if user already exists
        const exists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (exists.rows.length > 0) {
            throw new AppError(409, 'User already exists.');
        }

        // 3. Validate and Hash Password
        if (!password) {
            throw new AppError(400, 'Admin accounts must have a password.');
        }
        const hashedPassword = await hashPassword(password);

        // 4. Insert the Admin User
        const query = `
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, full_name, email, role, created_at
    `;

        const result: QueryResult<User> = await db.query(query, [email, hashedPassword, fullName]);

        return result.rows[0];
    }

    /**
     * Retrieves a list of all Admins and SuperAdmins.
     */
    public async getAllAdmins(): Promise<User[]> {
        const query = `
      SELECT id, full_name, email, role, profile_image_url, created_at 
      FROM users 
      WHERE role IN ('admin', 'superadmin') 
      ORDER BY created_at DESC
    `;

        const result: QueryResult<User> = await db.query(query);

        // Return empty array instead of null for better frontend handling
        return result.rows;
    }

    /**
     * Retrieves a specific Admin by ID.
     */
    public async getAdminById(id: string): Promise<User | null> {
        const query = `
      SELECT id, full_name, email, role, profile_image_url, created_at 
      FROM users 
      WHERE id = $1 AND role IN ('admin', 'superadmin')
    `;

        const result: QueryResult<User> = await db.query(query, [id]);

        if (result.rows.length === 0) return null;

        return result.rows[0];
    }

    /**
     * Deletes an Admin account.
     */
    public async deleteAdmin(id: string): Promise<User | null> {
        // Prevent deleting yourself or other superadmins (optional safety check logic could go here)
        const query = `
      DELETE FROM users 
      WHERE id = $1 AND role = 'admin' 
      RETURNING id, email, role
    `;

        const result: QueryResult<User> = await db.query(query, [id]);

        if (result.rows.length === 0) return null;

        return result.rows[0];
    }
}