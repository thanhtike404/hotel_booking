import { PrismaClient } from '@prisma/client'

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

  console.log('Seeded:', hotels)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })