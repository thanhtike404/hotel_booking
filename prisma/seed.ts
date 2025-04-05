import { PrismaClient, RoomType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.hotel.deleteMany()

  // Create hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: "Luxury Ocean Resort",
        description: "A beautiful beachfront resort with stunning ocean views and world-class amenities.",
        location: "Malibu, California",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        rating: 4.8,
        pricePerNight: 450,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Room Service"],
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Mountain View Lodge",
        description: "Cozy mountain retreat perfect for outdoor enthusiasts and nature lovers.",
        location: "Aspen, Colorado",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        rating: 4.5,
        pricePerNight: 350,
        featured: true,
        amenities: ["Free WiFi", "Parking", "Fitness Center", "Restaurant", "Bar"],
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Urban Boutique Hotel",
        description: "Modern boutique hotel in the heart of the city, walking distance to major attractions.",
        location: "New York City, NY",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        rating: 4.6,
        pricePerNight: 300,
        featured: false,
        amenities: ["Free WiFi", "Restaurant", "Bar", "Room Service", "Business Center"],
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Desert Oasis Resort",
        description: "Luxurious desert resort featuring private pools and spectacular sunset views.",
        location: "Phoenix, Arizona",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        rating: 4.7,
        pricePerNight: 400,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Fitness Center"],
      },
    }),
  ])

  console.log('Seeded hotels:', hotels)

  // Create rooms for each hotel
  for (const hotel of hotels) {
    const roomTypes = [
      {
        type: RoomType.SINGLE,
        total: Math.floor(Math.random() * 10) + 10, // 10-20 single rooms
        availabilityPercentage: 0.7, // 70% availability
      },
      {
        type: RoomType.DOUBLE,
        total: Math.floor(Math.random() * 15) + 15, // 15-30 double rooms
        availabilityPercentage: 0.8, // 80% availability
      },
      {
        type: RoomType.TWIN,
        total: Math.floor(Math.random() * 8) + 7, // 7-15 twin rooms
        availabilityPercentage: 0.75, // 75% availability
      },
      {
        type: RoomType.SUITE,
        total: Math.floor(Math.random() * 5) + 5, // 5-10 suites
        availabilityPercentage: 0.9, // 90% availability
      },
      {
        type: RoomType.FAMILY,
        total: Math.floor(Math.random() * 6) + 4, // 4-10 family rooms
        availabilityPercentage: 0.85, // 85% availability
      },
    ];

    // Create rooms for each type
    for (const roomConfig of roomTypes) {
      const total = roomConfig.total;
      const available = Math.floor(total * roomConfig.availabilityPercentage);

      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          roomType: roomConfig.type,
          total: total,
          available: available,
        },
      });
    }

    console.log(`Created rooms for hotel: ${hotel.name}`);
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })