import { db } from "../config/db";
import { User, RegisterDto } from "../common/types/types";
import { AppError } from "../middleware/error.handler";
import { hashPassword } from "../utils/password.utils";
import { QueryResult } from "pg";


export const createAdmin = async (data: RegisterDto) : Promise<User> => {

    if(!data.email.endsWith("@hopinAdmin.email")){
        throw new AppError(400, "Admin accounts must use @hopinAdmin.email")
    }

    const exists = await db.query('SELECT * FROM users WHERE email = $1', [data.email])
    if(exists.rows.length > 0){
        throw new AppError(409, 'User already exists')
    }

    if(!data.password){
        throw new AppError(400, 'Admin should have password')
    }
    const hashedPassword = await hashPassword(data.password)

    const result: QueryResult<User>  = await db.query(`INSERT INTO users (email, password_hash, full_name, role)
                                    VALUES ($1, $2, $3, admin)
                                    RETURNING id, full_name, email, role, created_at`, [data.email, hashedPassword, data.fullName])
                                    
    return result.rows[0] as User;
}

export const getAllAdmins = async (): Promise<User[] | null> => {

    const qString = `SELECT * FROM users WHERE role IN (admin, superadmin) ORDER BY created_at DESC`

    const result: QueryResult<User> = await db.query(qString)

    if(result.rows.length == 0) return null

    return result.rows
}

export const getAdminById = async (id: string): Promise<User | null> => {

    const qString = `SELECT * FROM users WHERE id = $1`

    const result: QueryResult<User> = await db.query(qString, [id])

    if(result.rows.length == 0) return null

    return result.rows[0]
}

export const deleteAdmin = async(id: string): Promise<User | null> => {

    const qString = `DELETE FROM users WHERE id = $1 RETURNING *`

    const result: QueryResult<User> = await db.query(qString, [id])
    
    if(result.rows.length == 0) return null

    return result.rows[0]  
} 

