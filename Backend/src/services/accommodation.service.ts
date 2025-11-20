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

export const update = async (id: number, data: Partial<Accommodation>): Promise<Accommodation | null> =>{

    
    
    const qString = `UPDATE TABLE accommodations
                     SET name  `

    const result: QueryResult<Accommodation> = await db.query(qString, values)

    if(result.rows.length == 0 ) return null

    return result.rows[0]
}

export const deleteById = async (id: number) => {
  //Todo
};

export const create = async (
  data: Partial<Accommodation>
): Promise<Accommodation | null> => {
  //Todo
  return null;
};
