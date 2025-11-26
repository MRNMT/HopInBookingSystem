import { db } from '../config/db';

const accommodations = [
    {
        name: 'HopIn Gauteng',
        description: 'Experience luxury in the heart of South Africa\'s economic hub. Modern amenities meet African hospitality.',
        address: '123 Nelson Mandela Square',
        city: 'Johannesburg',
        country: 'South Africa',
        latitude: -26.1076,
        longitude: 28.0567,
        star_rating: 5,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Western Cape',
        description: 'Breathtaking views of Table Mountain and the Atlantic Ocean. Perfect blend of nature and luxury.',
        address: '456 V&A Waterfront',
        city: 'Cape Town',
        country: 'South Africa',
        latitude: -33.9249,
        longitude: 18.4241,
        star_rating: 5,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn KwaZulu-Natal',
        description: 'Coastal paradise with golden beaches and warm Indian Ocean waters. Gateway to the Drakensberg.',
        address: '789 Marine Parade',
        city: 'Durban',
        country: 'South Africa',
        latitude: -29.8587,
        longitude: 31.0218,
        star_rating: 4,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Eastern Cape',
        description: 'Rich in history and natural beauty. Close to pristine beaches and wildlife reserves.',
        address: '321 Beachfront Drive',
        city: 'Port Elizabeth',
        country: 'South Africa',
        latitude: -33.9608,
        longitude: 25.6022,
        star_rating: 4,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Limpopo',
        description: 'Gateway to the Kruger National Park. Experience authentic African wildlife and culture.',
        address: '654 Polokwane Central',
        city: 'Polokwane',
        country: 'South Africa',
        latitude: -23.9045,
        longitude: 29.4689,
        star_rating: 4,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Mpumalanga',
        description: 'Panoramic views of the Lowveld. Perfect base for exploring Blyde River Canyon.',
        address: '987 Panorama Route',
        city: 'Mbombela',
        country: 'South Africa',
        latitude: -25.4753,
        longitude: 30.9694,
        star_rating: 4,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn North West',
        description: 'Tranquil retreat in the platinum belt. Close to Sun City and Pilanesberg.',
        address: '147 Platinum Highway',
        city: 'Rustenburg',
        country: 'South Africa',
        latitude: -25.6672,
        longitude: 27.2423,
        star_rating: 3,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Free State',
        description: 'Heartland hospitality with stunning sunsets. Explore the golden fields and rich heritage.',
        address: '258 President Brand Street',
        city: 'Bloemfontein',
        country: 'South Africa',
        latitude: -29.1211,
        longitude: 26.2142,
        star_rating: 3,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },
    {
        name: 'HopIn Northern Cape',
        description: 'Desert diamond under the stars. Experience the Kalahari and Namaqualand flowers.',
        address: '369 Diamond Road',
        city: 'Kimberley',
        country: 'South Africa',
        latitude: -28.7282,
        longitude: 24.7499,
        star_rating: 3,
        policies: 'Check-in: 14:00 | Check-out: 11:00 | No smoking | Pets allowed with prior arrangement'
    },

    {
        name: 'HopIn Paris',
        description: 'Elegance and romance in the City of Light. Steps away from the Eiffel Tower and Champs-Élysées.',
        address: '12 Avenue des Champs-Élysées',
        city: 'Paris',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
        star_rating: 5,
        policies: 'Check-in: 15:00 | Check-out: 12:00 | No smoking | No pets'
    },
    {
        name: 'HopIn Tokyo',
        description: 'Modern luxury meets traditional Japanese hospitality. In the heart of Shibuya.',
        address: '1-1-1 Shibuya',
        city: 'Tokyo',
        country: 'Japan',
        latitude: 35.6762,
        longitude: 139.6503,
        star_rating: 5,
        policies: 'Check-in: 15:00 | Check-out: 11:00 | No smoking | No pets'
    },
    {
        name: 'HopIn Moscow',
        description: 'Imperial grandeur near Red Square. Experience Russian culture and architecture.',
        address: '5 Tverskaya Street',
        city: 'Moscow',
        country: 'Russia',
        latitude: 55.7558,
        longitude: 37.6173,
        star_rating: 5,
        policies: 'Check-in: 14:00 | Check-out: 12:00 | No smoking | No pets'
    },
    {
        name: 'HopIn Sydney',
        description: 'Harbour views and coastal luxury. Walking distance to Opera House and Bondi Beach.',
        address: '88 Circular Quay',
        city: 'Sydney',
        country: 'Australia',
        latitude: -33.8688,
        longitude: 151.2093,
        star_rating: 5,
        policies: 'Check-in: 14:00 | Check-out: 10:00 | No smoking | Pets allowed with prior arrangement'
    }
];

const roomTypes = [
    { type_name: 'Deluxe Room', description: 'Comfortable room with modern amenities', price: 580, capacity: 2, inventory: 20 },
    { type_name: 'Premium Suite', description: 'Spacious suite with separate living area', price: 980, capacity: 3, inventory: 10 },
    { type_name: 'Metropolitan Suite', description: 'Luxury suite with panoramic views', price: 1580, capacity: 4, inventory: 5 }
];

async function seedAccommodations() {
    console.log(' Seeding accommodations...');

    try {
        for (const accom of accommodations) {
            const existing = await db.query(
                'SELECT id FROM accommodations WHERE city = $1 AND country = $2',
                [accom.city, accom.country]
            );

            let accommodationId;

            if (existing.rows.length > 0) {
                console.log(`    ${accom.name} already exists, updating...`);
                const updated = await db.query(
                    `UPDATE accommodations 
           SET name = $1, description = $2, address = $3, latitude = $4, 
               longitude = $5, star_rating = $6, policies = $7, is_active = true
           WHERE city = $8 AND country = $9
           RETURNING id`,
                    [accom.name, accom.description, accom.address, accom.latitude,
                    accom.longitude, accom.star_rating, accom.policies, accom.city, accom.country]
                );
                accommodationId = updated.rows[0].id;
            } else {
                console.log(`   + Creating ${accom.name}...`);
                const created = await db.query(
                    `INSERT INTO accommodations 
           (name, description, address, city, country, latitude, longitude, star_rating, policies, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
           RETURNING id`,
                    [accom.name, accom.description, accom.address, accom.city, accom.country,
                    accom.latitude, accom.longitude, accom.star_rating, accom.policies]
                );
                accommodationId = created.rows[0].id;
            }

            for (const room of roomTypes) {
                const existingRoom = await db.query(
                    'SELECT id FROM room_types WHERE accommodation_id = $1 AND type_name = $2',
                    [accommodationId, room.type_name]
                );

                if (existingRoom.rows.length === 0) {
                    await db.query(
                        `INSERT INTO room_types 
             (accommodation_id, type_name, description, price_per_night, capacity, total_inventory, is_available)
             VALUES ($1, $2, $3, $4, $5, $6, true)`,
                        [accommodationId, room.type_name, room.description, room.price, room.capacity, room.inventory]
                    );
                }
            }
        }

        console.log(' Successfully seeded accommodations!');
        console.log(`   Total: ${accommodations.length} locations`);
        console.log(`   - South African provinces: 9`);
        console.log(`   - International: 4 (France, Japan, Russia, Australia)`);

    } catch (error) {
        console.error(' Error seeding accommodations:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

seedAccommodations();
