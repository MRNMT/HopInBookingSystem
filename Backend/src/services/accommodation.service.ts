import { Accommodation } from "../../common/types/types";
//pool
import { db } from "../config/db";
import { QueryResult, Pool } from "pg";

//Get all
export const getAll = async (): Promise<Accommodation[] | null> => {
  const result: QueryResult<Accommodation> = await db.query(
    "SELECT * FROM accommodations"
  );

  if (result.rows.length === 0) return null;

  return result.rows;
};

//Get by ID 
export const getById = async (id: number): Promise<Accommodation | null> => {
  const qString = `SELECT * FROM accommodations WHERE id = $1`;
  const values = [id];

  const result: QueryResult<Accommodation> = await db.query(qString, values);

  if (result.rows.length == 0) return null;

  return result.rows[0];
};

//Get By city
export const getByCity = async (
  city: string
): Promise<Accommodation | null> => {
  const qString = `SELECT * FROM accommodations WHERE city = $1`;
  const values = [city];

  const result: QueryResult<Accommodation> = await db.query(qString, values);

  if (result.rows.length == 0) return null;

  return result.rows[0];
};

//Update
export const update = async (
  id: number,
  data: Partial<Accommodation>
): Promise<Accommodation | null> => {
  const values: any[] = [];
  const setClauses: string[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }

  if (data.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(data.description);
  }

  if (data.address !== undefined) {
    setClauses.push(`address = $${paramIndex++}`);
    values.push(data.address);
  }

  if (data.city !== undefined) {
    setClauses.push(`city = $${paramIndex++}`);
    values.push(data.city);
  }

  if (data.country !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(data.country);
  }

  if (data.star_rating !== undefined) {
    setClauses.push(`star_rating = $${paramIndex++}`);
    values.push(data.star_rating);
  }

  if (data.policies !== undefined) {
    setClauses.push(`policies = $${paramIndex++}`);
    values.push(data.policies);
  }

  if (data.is_active !== undefined) {
    setClauses.push(`is_active = $${paramIndex++}`);
    values.push(data.is_active);
  }

  const qString = `UPDATE TABLE accommodations
                     SET ${setClauses.join(",")}  
                     WHERE id = ${paramIndex}
                     RETURNING`;

  values.push(id);
  const result: QueryResult<Accommodation> = await db.query(qString, values);

  if (result.rows.length == 0) return null;

  return result.rows[0];
};


export const deleteById = async (id: number):  Promise<Accommodation | null> => {
  
  const values: any[] = [id]
  const qString = `DELETE FROM accommodation WHERE id = $1 RETURNING`

  const result: QueryResult<Accommodation> = await db.query(qString, values)
  
  if(result.rows.length == 0) return null

  return result.rows[0]
};


//create
export const create = async (
  data: Partial<Accommodation>
): Promise<Accommodation | null> => {

  const values: any [] = [data.name, data.description, data.address, data.city, data.country, data.star_rating,
     data.policies, data.is_active]
  const qString = `INSERT INTO accommodations VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING`

  const result: QueryResult<Accommodation> = await db.query(qString, values)
  
  if(result.rows.length === 0) return null;

  return result.rows[0]
};
