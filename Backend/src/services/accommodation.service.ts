import { Accommodation, CreateAccommodationDto } from "../common/types/types"; // Fixed import path
import { db } from "../config/db"; // Use the db helper
import pool from "../config/db"; // Import pool for transactions
import { QueryResult } from "pg";

const BASE_QUERY = `
  SELECT 
    a.*, 
    COALESCE(ai.images, '[]'::jsonb) as images,
    (
      SELECT json_agg(json_build_object('id', f.id, 'name', f.name, 'icon', f.icon_name))
      FROM accommodation_facilities af
      JOIN facilities f ON af.facility_id = f.id
      WHERE af.accommodation_id = a.id
    ) as facilities,
    COALESCE(ROUND(AVG(r.rating), 1), 0)::float as average_rating,
    COUNT(DISTINCT r.id)::int as total_reviews,
    COALESCE(MIN(rt.price_per_night), 0) as min_price,
    COALESCE(MAX(rt.capacity), 0) as max_capacity
  FROM accommodations a
  LEFT JOIN accommodation_images ai ON a.id = ai.accommodation_id
  LEFT JOIN reviews r ON a.id = r.accommodation_id AND r.is_approved = true
  LEFT JOIN room_types rt ON a.id = rt.accommodation_id AND rt.is_available = true
`;

const GROUP_BY = `GROUP BY a.id, ai.accommodation_id`;

export class AccommodationService {

  public async getAll(): Promise<Accommodation[]> {
    const query = `${BASE_QUERY} WHERE a.is_active = true ${GROUP_BY} ORDER BY a.created_at DESC`;
    const result: QueryResult<Accommodation> = await db.query(query);

    const aboutMessages = [
      "Experience luxury and comfort in this beautifully appointed accommodation. Perfect for both business and leisure travelers.",
      "Discover a haven of tranquility with modern amenities and exceptional service. Your home away from home awaits.",
      "Immerse yourself in elegance and style. This property offers the perfect blend of comfort and sophistication.",
      "Enjoy a memorable stay with world-class facilities and warm hospitality. Every detail has been carefully considered for your comfort.",
      "Relax and unwind in this stunning property. Designed with your comfort in mind, offering all the amenities you need.",
      "A perfect retreat for travelers seeking comfort and convenience. Experience hospitality at its finest.",
      "Step into a world of comfort and luxury. This accommodation promises an unforgettable stay experience.",
      "Your perfect getaway destination. Combining modern comfort with exceptional service and attention to detail."
    ];

    const accommodations = result.rows.map(acc => ({
      ...acc,
      about: aboutMessages[Math.floor(Math.random() * aboutMessages.length)]
    }));


    return accommodations;
  }

  public async search(filters: any): Promise<Accommodation[]> {
    return this.getAll();
  }

  public async getById(id: string): Promise<Accommodation | null> {
    try {
      const query = `
        SELECT 
          a.*, 
          COALESCE(ai.images, '[]'::jsonb) as images,
          (
            SELECT json_agg(json_build_object('id', f.id, 'name', f.name, 'icon', f.icon_name))
            FROM accommodation_facilities af
            JOIN facilities f ON af.facility_id = f.id
            WHERE af.accommodation_id = a.id
          ) as facilities,
          COALESCE(ROUND(AVG(r.rating), 1), 0)::float as average_rating,
          COUNT(r.id)::int as total_reviews
        FROM accommodations a
        LEFT JOIN accommodation_images ai ON a.id = ai.accommodation_id
        LEFT JOIN reviews r ON a.id = r.accommodation_id AND r.is_approved = true
        WHERE a.id = $1 AND a.is_active = true
        GROUP BY a.id, ai.accommodation_id
      `;
      const result: QueryResult<Accommodation> = await db.query(query, [id]);

      if (result.rows.length === 0) {
        console.log(`No accommodation found with ID: ${id}`);
        return null;
      }

      const aboutMessages = [
        "Experience luxury and comfort in this beautifully appointed accommodation. Perfect for both business and leisure travelers.",
        "Discover a haven of tranquility with modern amenities and exceptional service. Your home away from home awaits.",
        "Immerse yourself in elegance and style. This property offers the perfect blend of comfort and sophistication.",
        "Enjoy a memorable stay with world-class facilities and warm hospitality. Every detail has been carefully considered for your comfort.",
        "Relax and unwind in this stunning property. Designed with your comfort in mind, offering all the amenities you need.",
        "A perfect retreat for travelers seeking comfort and convenience. Experience hospitality at its finest.",
        "Step into a world of comfort and luxury. This accommodation promises an unforgettable stay experience.",
        "Your perfect getaway destination. Combining modern comfort with exceptional service and attention to detail."
      ];

      const accommodation = {
        ...result.rows[0],
        about: aboutMessages[Math.floor(Math.random() * aboutMessages.length)]
      };

      console.log(`Found accommodation: ${accommodation.name}`);
      console.log('Facilities:', accommodation.facilities);
      return accommodation;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  public async getByCity(city: string): Promise<Accommodation[]> {
    const query = `${BASE_QUERY} WHERE a.city ILIKE $1 AND a.is_active = true ${GROUP_BY}`;
    const result: QueryResult<Accommodation> = await db.query(query, [`%${city}%`]);
    return result.rows;
  }

  public async create(data: CreateAccommodationDto, adminId?: string): Promise<Accommodation | null> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const fields = ['name', 'description', 'address', 'city', 'country', 'star_rating', 'policies', 'created_by'];
      const values = [
        data.name, data.description, data.address, data.city, data.country,
        data.star_rating, data.policies, adminId
      ];

      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const insertQuery = `
        INSERT INTO accommodations (${fields.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await client.query(insertQuery, values);
      const newAccommodation = result.rows[0];

      const imagesJson = JSON.stringify(data.images || []);
      await client.query(
        `INSERT INTO accommodation_images (accommodation_id, images) VALUES ($1, $2)`,
        [newAccommodation.id, imagesJson]
      );

      if (data.facilities && data.facilities.length > 0) {
        for (const facilityId of data.facilities) {
          await client.query(
            `INSERT INTO accommodation_facilities (accommodation_id, facility_id) VALUES ($1, $2)`,
            [newAccommodation.id, facilityId]
          );
        }
      }

      await client.query('COMMIT');
      return newAccommodation;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async update(id: string, data: Partial<Accommodation>): Promise<Accommodation | null> {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

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

    if (setClauses.length === 0) return null;

    values.push(id);

    const query = `
      UPDATE accommodations 
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result: QueryResult<Accommodation> = await db.query(query, values);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  public async delete(id: string): Promise<void> {
    const query = `UPDATE accommodations SET is_active = false WHERE id = $1`;
    const result = await db.query(query, [id]);

    if ((result.rowCount ?? 0) === 0) {
    }
  }

  public async getAllAdmin(): Promise<Accommodation[]> {
    const result = await db.query('SELECT * FROM accommodations ORDER BY created_at DESC');
    return result.rows;
  }
}
