import Accommodation from "../types/accommodation.type";
//pool
import { db } from "../config/db";
import { QueryResult, Pool } from "pg";

export const getAll = async (): Promise<Accommodation[]> => {
  const result: QueryResult<Accommodation> = await db.query(
    "SELECT * FROM accommodations"
  );

  return result.rows;
};

export const getById = async (id: number): Promise<Accommodation | null> => {
  const qString = `SELECT * FROM accommodations WHERE id = $1`;
  const values = [id];

  const result: QueryResult<Accommodation> = await db.query(qString, values);

  if (result.rows.length == 0) return null;

  return result.rows[0];
};

export const getByCity = async (
  city: string
): Promise<Accommodation | null> => {
  //todo
  return null;
};

export const update = async (
  id: number,
  data: Partial<Accommodation>
): Promise<Accommodation | null> => {

  const values: any[] = []
  const setClauses: string [] = []
  let paramIndex = 1

  if(data.name !== undefined){
    setClauses.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }

  if(data.description !== undefined){
    setClauses.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }

  if(data.address !== undefined){
    setClauses.push(`address = $${paramIndex++}`)
    values.push(data.address)
  }

  if(data.city !== undefined){
    setClauses.push(`city = $${paramIndex++}`)
    values.push(data.city)
  }

  if(data.country !== undefined){
    setClauses.push(`name = $${paramIndex++}`)
    values.push(data.country)
  }

  if(data.starRating !== undefined){
    setClauses.push(`starRating = $${paramIndex++}`)
    values.push(data.starRating)
  }

  if(data.policies !== undefined){
    setClauses.push(`policies = $${paramIndex++}`)
    values.push(data.policies)
  }

  if(data.isActive !== undefined){
    setClauses.push(`isActive = $${paramIndex++}`)
    values.push(data.isActive)
  }

  const qString = `UPDATE TABLE accommodations
                     SET ${setClauses.join(',')}  
                     WHERE id = ${paramIndex}
                     RETURNING`

  const result: QueryResult<Accommodation> = await db.query(qString, values);

  if (result.rows.length == 0) return null;

  return result.rows[0];
};

export const deleteById = async (id: number) => {
  //Todo
};

export const create = async (
  data: Partial<Accommodation>
): Promise<Accommodation | null> => {
  //Todo
  return null;
};
