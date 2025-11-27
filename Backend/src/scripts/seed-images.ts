import { db } from '../config/db';

const HOTEL_IMAGES = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590073242678-cfea53382e52?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512918760532-3ed64bc8066e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560200353-ce0a76b1d438?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80"
];

async function seedImages() {
    try {
        console.log('Seeding accommodation images...');

        const accoms = await db.query('SELECT id, name FROM accommodations');

        for (const accom of accoms.rows) {
            const shuffled = [...HOTEL_IMAGES].sort(() => 0.5 - Math.random());
            const selectedImages = shuffled.slice(0, 5);

            await db.query(
                `INSERT INTO accommodation_images (accommodation_id, images)
                 VALUES ($1, $2)
                 ON CONFLICT (accommodation_id) 
                 DO UPDATE SET images = $2`,
                [accom.id, JSON.stringify(selectedImages)]
            );

            console.log(`Updated images for ${accom.name}`);
        }

        console.log('All accommodations updated with 5 images each!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding images:', error);
        process.exit(1);
    }
}

seedImages();
