import { PrismaClient, RoomType } from '@prisma/client'

const prisma = new PrismaClient()

function getRoomImage(type: RoomType): string {
  switch (type) {
    case RoomType.SINGLE:
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    case RoomType.DOUBLE:
      return "https://images.unsplash.com/photo-1600585154154-146c2fd5f9b2"
    case RoomType.TWIN:
      return "https://images.unsplash.com/photo-1582719478181-51f1f8c1b2ec"
    case RoomType.SUITE:
      return "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
    case RoomType.FAMILY:
      return "https://images.unsplash.com/photo-1600585154035-00c1f8a6ee12"
    default:
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  }
}

function getRoomPrice(type: RoomType): number {
  switch (type) {
    case RoomType.SINGLE:
      return 100
    case RoomType.DOUBLE:
      return 150
    case RoomType.TWIN:
      return 130
    case RoomType.SUITE:
      return 250
    case RoomType.FAMILY:
      return 200
    default:
      return 120
  }
}

async function main() {
  await prisma.hotel.deleteMany()

  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: "Luxury Ocean Resort",
        description: "A beautiful beachfront resort with stunning ocean views and world-class amenities.",
        location: "Malibu, California",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        rating: 4.8,
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
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Fitness Center"],
      },
    }),
  ])

  console.log('Seeded hotels:', hotels)

  for (const hotel of hotels) {
    const roomTypes = [
      {
        type: RoomType.SINGLE,
        total: Math.floor(Math.random() * 10) + 10,
        availabilityPercentage: 0.7,
      },
      {
        type: RoomType.DOUBLE,
        total: Math.floor(Math.random() * 15) + 15,
        availabilityPercentage: 0.8,
      },
      {
        type: RoomType.TWIN,
        total: Math.floor(Math.random() * 8) + 7,
        availabilityPercentage: 0.75,
      },
      {
        type: RoomType.SUITE,
        total: Math.floor(Math.random() * 5) + 5,
        availabilityPercentage: 0.9,
      },
      {
        type: RoomType.FAMILY,
        total: Math.floor(Math.random() * 6) + 4,
        availabilityPercentage: 0.85,
      },
    ]

    for (const roomConfig of roomTypes) {
      const total = roomConfig.total
      const available = Math.floor(total * roomConfig.availabilityPercentage)

      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          roomType: roomConfig.type,
          total,
          available,
          image: getRoomImage(roomConfig.type),
          price: getRoomPrice(roomConfig.type),
          amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom"],
        },
      })
    }

    console.log(`Created rooms for hotel: ${hotel.name}`)
  }

  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
