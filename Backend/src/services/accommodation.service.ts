import { Accommodation } from "../../common/types/types"; // Corrected import path
import { db } from "../config/db";
import { QueryResult } from "pg";

// ==========================================================================
// HELPER: The Base Query
// We use this reusable string to ensure we always fetch images and calculating ratings
// ==========================================================================
const BASE_QUERY = `
  SELECT 
    a.*, 
    COALESCE(ai.images, '[]'::jsonb) as images,
    COALESCE(ROUND(AVG(r.rating), 1), 0)::float as average_rating,
    COUNT(r.id)::int as total_reviews
  FROM accommodations a
  LEFT JOIN accommodation_images ai ON a.id = ai.accommodation_id
  LEFT JOIN reviews r ON a.id = r.accommodation_id AND r.is_approved = true
`;

const GROUP_BY = `GROUP BY a.id, ai.accommodation_id`;

// ==========================================================================
// READ OPERATIONS
// ==========================================================================

export const getAll = async (): Promise<Accommodation[]> => {
  const query = `${BASE_QUERY} WHERE a.is_active = true ${GROUP_BY} ORDER BY a.created_at DESC`;
  const result: QueryResult<Accommodation> = await db.query(query);
  return result.rows;
};

export const getById = async (id: string): Promise<Accommodation | null> => {
  const query = `${BASE_QUERY} WHERE a.id = $1 ${GROUP_BY}`;
  const result: QueryResult<Accommodation> = await db.query(query, [id]);

  if (result.rows.length === 0) return null;
  return result.rows[0];
};

export const getByCity = async (city: string): Promise<Accommodation[]> => {
  const query = `${BASE_QUERY} WHERE a.city ILIKE $1 AND a.is_active = true ${GROUP_BY}`;
  const result: QueryResult<Accommodation> = await db.query(query, [`%${city}%`]);
  return result.rows;
};

// ==========================================================================
// WRITE OPERATIONS
// ==========================================================================

export const create = async (data: Partial<Accommodation>, adminId?: string): Promise<Accommodation | null> => {
  // 1. Insert the Accommodation
  const fields = ['name', 'description', 'address', 'city', 'country', 'star_rating', 'policies', 'created_by'];
  const values = [
    data.name, data.description, data.address, data.city, data.country, 
    data.star_rating, data.policies, adminId
  ];
  
  // Dynamically build placeholders ($1, $2...)
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const insertQuery = `
    INSERT INTO accommodations (${fields.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `;

  const result = await db.query(insertQuery, values);
  
  if (result.rows.length === 0) return null;
  const newAccommodation = result.rows[0];

  // 2. Insert Empty Images Record (so the LEFT JOIN works later)
  // If you have images in 'data', you would insert them here.
  await db.query(
    `INSERT INTO accommodation_images (accommodation_id, images) VALUES ($1, '[]'::jsonb)`, 
    [newAccommodation.id]
  );

  return newAccommodation;
};

export const update = async (id: string, data: Partial<Accommodation>): Promise<Accommodation | null> => {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Helper to push fields conditionally
  const addField = (key: string, value: any) => {
    if (value !== undefined) {
      setClauses.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
  };

  addField('name', data.name);
  addField('description', data.description);
  addField('address', data.address);
  addField('city', data.city);
  addField('country', data.country);
  addField('star_rating', data.star_rating);
  addField('policies', data.policies);
  addField('is_active', data.is_active);

  if (setClauses.length === 0) return null; // Nothing to update

  values.push(id); // Add ID as the last parameter

  const query = `
    UPDATE accommodations 
    SET ${setClauses.join(", ")}, updated_at = NOW()
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result: QueryResult<Accommodation> = await db.query(query, values);

  if (result.rows.length === 0) return null;
  return result.rows[0];
};

export const deleteById = async (id: string): Promise<boolean> => {
  // We perform a "Soft Delete" by setting is_active to false
  const query = `UPDATE accommodations SET is_active = false WHERE id = $1`;
  const result = await db.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};