import { PrismaClient, RoomType } from '@prisma/client'

const prisma = new PrismaClient()

function getRoomImage(type: RoomType): string {
  switch (type) {
    case RoomType.SINGLE:
      return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80" // Single room
    case RoomType.DOUBLE:
      return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80" // Double room
    case RoomType.TWIN:
      return "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80" // Twin room
    case RoomType.SUITE:
      return "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80" // Suite
    case RoomType.FAMILY:
      return "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80" // Family room
    default:
      return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80"
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
  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.room.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.city.deleteMany()
  await prisma.country.deleteMany()

    // Create countries
  const usa = await prisma.country.create({
    data: {
      name: "United States",
      code: "US"
    }
  })

  // Create cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        name: "Malibu",
        countryId: usa.id
      }
    }),
    prisma.city.create({
      data: {
        name: "Aspen",
        countryId: usa.id
      }
    }),
    prisma.city.create({
      data: {
        name: "New York City",
        countryId: usa.id
      }
    }),
    prisma.city.create({
      data: {
        name: "Phoenix",
        countryId: usa.id
      }
    })
  ])

  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: "Luxury Ocean Resort",
        description: "A beautiful beachfront resort with stunning ocean views and world-class amenities.",
        cityId: cities[0].id,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80",
        rating: 4.8,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Room Service"],
        latitude: 34.0259,
        longitude: -118.7798
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Mountain View Lodge",
        description: "Cozy mountain retreat perfect for outdoor enthusiasts and nature lovers.",
        cityId: cities[1].id,
        image: "https://images.unsplash.com/photo-1610530531783-56a4e92a3305?q=80",
        rating: 4.5,
        featured: true,
        amenities: ["Free WiFi", "Parking", "Fitness Center", "Restaurant", "Bar"],
        latitude: 39.1911,
        longitude: -106.8175
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Urban Boutique Hotel",
        description: "Modern boutique hotel in the heart of the city, walking distance to major attractions.",
        cityId: cities[2].id,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80",
        rating: 4.6,
        featured: false,
        amenities: ["Free WiFi", "Restaurant", "Bar", "Room Service", "Business Center"],
        latitude: 40.7128,
        longitude: -74.0060
      },
    }),
    prisma.hotel.create({
      data: {
        name: "Desert Oasis Resort",
        description: "Luxurious desert resort featuring private pools and spectacular sunset views.",
        cityId: cities[3].id,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80",
        rating: 4.7,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Fitness Center"],
        latitude: 33.4484,
        longitude: -112.0740
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
          amenities: ["Free WiFi", "Air Conditioning", "Private Bathroom", "TV", "Mini Bar"],
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
