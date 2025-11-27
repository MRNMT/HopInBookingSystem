import { db } from './config/db';

async function seedRoomTypes() {
    try {
        console.log('Adding room types to all accommodations...\n');

        const accomsResult = await db.query('SELECT id, name FROM accommodations');
        const accommodations = accomsResult.rows;

        console.log(`Found ${accommodations.length} accommodations\n`);

        const roomTypeTemplates = [
            {
                type_name: 'Standard Room',
                description: 'Comfortable room with modern amenities',
                price_per_night: 580.00,
                capacity: 2,
                total_inventory: 20
            },
            {
                type_name: 'Deluxe Suite',
                description: 'Spacious suite with premium furnishings and city views',
                price_per_night: 1200.00,
                capacity: 4,
                total_inventory: 10
            },
            {
                type_name: 'Executive Suite',
                description: 'Luxury suite with separate living area and exclusive amenities',
                price_per_night: 2500.00,
                capacity: 4,
                total_inventory: 5
            }
        ];

        let addedCount = 0;

        for (const accom of accommodations) {
            const existingRooms = await db.query(
                'SELECT COUNT(*) as count FROM room_types WHERE accommodation_id = $1',
                [accom.id]
            );

            if (parseInt(existingRooms.rows[0].count) > 0) {
                console.log(`${accom.name} already has room types, skipping...`);
                continue;
            }

            console.log(`Adding room types to: ${accom.name}`);

            for (const template of roomTypeTemplates) {
                await db.query(
                    `INSERT INTO room_types 
                    (accommodation_id, type_name, description, price_per_night, capacity, total_inventory, is_available)
                    VALUES ($1, $2, $3, $4, $5, $6, true)`,
                    [
                        accom.id,
                        template.type_name,
                        template.description,
                        template.price_per_night,
                        template.capacity,
                        template.total_inventory
                    ]
                );
            }

            addedCount++;
        }

        console.log(`\nSuccessfully added room types to ${addedCount} accommodations!`);

        const totalRooms = await db.query('SELECT COUNT(*) as count FROM room_types');
        console.log(`Total room types in database: ${totalRooms.rows[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seedRoomTypes();
