import { db } from '../config/db';

const COMMON_FACILITIES = [
    { name: 'Free WiFi', icon_name: 'wifi', category: 'General' },
    { name: 'Swimming Pool', icon_name: 'pool', category: 'Activities' },
    { name: 'Fitness Center', icon_name: 'fitness_center', category: 'Activities' },
    { name: 'Free Parking', icon_name: 'local_parking', category: 'General' },
    { name: 'Restaurant', icon_name: 'restaurant', category: 'Dining' },
    { name: 'Bar', icon_name: 'local_bar', category: 'Dining' },
    { name: 'Room Service', icon_name: 'room_service', category: 'Services' },
    { name: 'Air Conditioning', icon_name: 'ac_unit', category: 'General' },
    { name: 'Spa', icon_name: 'spa', category: 'Wellness' },
    { name: 'Conference Room', icon_name: 'meeting_room', category: 'Business' }
];

async function seedFacilities() {
    try {
        console.log('Seeding facilities...');

        for (const facility of COMMON_FACILITIES) {
            await db.query(
                `INSERT INTO facilities (name, icon_name, category)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (name) DO NOTHING`,
                [facility.name, facility.icon_name, facility.category]
            );
        }

        const facilitiesRes = await db.query('SELECT id FROM facilities');
        const allFacilityIds = facilitiesRes.rows.map(f => f.id);

        const accomsRes = await db.query('SELECT id, name FROM accommodations');

        for (const accom of accomsRes.rows) {
            const shuffled = [...allFacilityIds].sort(() => 0.5 - Math.random());
            const selectedIds = shuffled.slice(0, Math.floor(Math.random() * 4) + 3);


            for (const facilityId of selectedIds) {
                await db.query(
                    `INSERT INTO accommodation_facilities (accommodation_id, facility_id)
                     VALUES ($1, $2)
                     ON CONFLICT (accommodation_id, facility_id) DO NOTHING`,
                    [accom.id, facilityId]
                );
            }
            console.log(`Added ${selectedIds.length} facilities to ${accom.name}`);
        }

        console.log('Successfully seeded facilities for all accommodations');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding facilities:', error);
        process.exit(1);
    }
}

seedFacilities();
