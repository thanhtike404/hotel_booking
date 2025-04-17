import { PrismaClient, RoomType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Helper functions
function getRoomImage(type: RoomType): string {
  switch (type) {
    case RoomType.SINGLE: return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80"
    case RoomType.DOUBLE: return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80"
    case RoomType.TWIN: return "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80"
    case RoomType.SUITE: return "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80"
    case RoomType.FAMILY: return "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80"
    default: return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80"
  }
}

function getRoomPrice(type: RoomType): number {
  switch (type) {
    case RoomType.SINGLE: return 100
    case RoomType.DOUBLE: return 150
    case RoomType.TWIN: return 130
    case RoomType.SUITE: return 250
    case RoomType.FAMILY: return 200
    default: return 120
  }
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

async function main() {
  // Clear existing data
  await prisma.verificationToken.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.room.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.city.deleteMany()
  await prisma.country.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create countries with images
  const countries = await Promise.all([
    prisma.country.create({
      data: {
        name: "United States",
        code: "US",
        image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80"
      }
    }),
    prisma.country.create({
      data: {
        name: "Canada",
        code: "CA",
        image: "https://images.unsplash.com/photo-1504941214544-9c1c44559ab4?q=80"
      }
    }),
    prisma.country.create({
      data: {
        name: "France",
        code: "FR",
        image: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80"
      }
    }),
    prisma.country.create({
      data: {
        name: "Japan",
        code: "JP",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80"
      }
    }),
    prisma.country.create({
      data: {
        name: "Australia",
        code: "AU",
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80"
      }
    }),
    prisma.country.create({
      data: {
        name: "Brazil",
        code: "BR",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80"
      }
    }),
  ])

  // Create cities for each country with images
  const cities = await Promise.all([
    // US Cities
    prisma.city.create({
      data: {
        name: "New York",
        countryId: countries[0].id,
        image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Los Angeles",
        countryId: countries[0].id,
        image: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Chicago",
        countryId: countries[0].id,
        image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80"
      }
    }),

    // Canada Cities
    prisma.city.create({
      data: {
        name: "Toronto",
        countryId: countries[1].id,
        image: "https://images.unsplash.com/photo-1534235826755-84464d97b044?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Vancouver",
        countryId: countries[1].id,
        image: "https://images.unsplash.com/photo-1578640463869-80e0df0491e3?q=80"
      }
    }),

    // France Cities
    prisma.city.create({
      data: {
        name: "Paris",
        countryId: countries[2].id,
        image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Nice",
        countryId: countries[2].id,
        image: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80"
      }
    }),

    // Japan Cities
    prisma.city.create({
      data: {
        name: "Tokyo",
        countryId: countries[3].id,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Kyoto",
        countryId: countries[3].id,
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80"
      }
    }),

    // Australia Cities
    prisma.city.create({
      data: {
        name: "Sydney",
        countryId: countries[4].id,
        image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "Melbourne",
        countryId: countries[4].id,
        image: "https://images.unsplash.com/photo-1545044846-351ba102b6d5?q=80"
      }
    }),

    // Brazil Cities
    prisma.city.create({
      data: {
        name: "Rio de Janeiro",
        countryId: countries[5].id,
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80"
      }
    }),
    prisma.city.create({
      data: {
        name: "São Paulo",
        countryId: countries[5].id,
        image: "https://images.unsplash.com/photo-1544989164-31f6a2a0b65e?q=80"
      }
    }),
  ])

  // Create destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        city: "New York",
        country: "United States",
        image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80",
        hotels: 12,
        rating: 4.7
      }
    }),
    prisma.destination.create({
      data: {
        city: "Paris",
        country: "France",
        image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80",
        hotels: 8,
        rating: 4.8
      }
    }),
    prisma.destination.create({
      data: {
        city: "Tokyo",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80",
        hotels: 10,
        rating: 4.6
      }
    }),
  ])

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        password: await hash("password123", 10),
        emailVerified: new Date(),
        image: "https://randomuser.me/api/portraits/men/1.jpg"
      }
    }),
    prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await hash("password123", 10),
        emailVerified: new Date(),
        image: "https://randomuser.me/api/portraits/women/1.jpg"
      }
    }),
    prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: "alex@example.com",
        password: await hash("password123", 10),
        emailVerified: new Date(),
        image: "https://randomuser.me/api/portraits/men/2.jpg"
      }
    }),
  ])

  // Create accounts for users
  await Promise.all([
    prisma.account.create({
      data: {
        userId: users[0].id,
        type: "credentials",
        provider: "email",
        providerAccountId: users[0].email!
      }
    }),
    prisma.account.create({
      data: {
        userId: users[1].id,
        type: "credentials",
        provider: "email",
        providerAccountId: users[1].email!
      }
    }),
    prisma.account.create({
      data: {
        userId: users[2].id,
        type: "credentials",
        provider: "email",
        providerAccountId: users[2].email!
      }
    }),
  ])

  // Create hotels
  const hotels = await Promise.all([
    // US Hotels
    prisma.hotel.create({
      data: {
        name: "Grand Plaza Hotel",
        description: "Luxury hotel in the heart of Manhattan with stunning city views.",
        cityId: cities[0].id,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80",
        rating: 4.8,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Fitness Center", "Room Service"],
        latitude: 40.7536,
        longitude: -73.9832
      }
    }),
    prisma.hotel.create({
      data: {
        name: "Beachfront Resort",
        description: "Beautiful beachfront property with ocean views and premium amenities.",
        cityId: cities[1].id,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80",
        rating: 4.6,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Beach Access", "Restaurant", "Bar"],
        latitude: 34.0259,
        longitude: -118.7798
      }
    }),

    // Canada Hotels
    prisma.hotel.create({
      data: {
        name: "Mountain View Lodge",
        description: "Cozy lodge with breathtaking mountain views and outdoor activities.",
        cityId: cities[3].id,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80",
        rating: 4.5,
        featured: false,
        amenities: ["Free WiFi", "Parking", "Restaurant", "Hot Tub"],
        latitude: 51.1784,
        longitude: -115.5708
      }
    }),

    // France Hotels
    prisma.hotel.create({
      data: {
        name: "Parisian Elegance",
        description: "Charming boutique hotel near the Eiffel Tower with classic Parisian style.",
        cityId: cities[5].id,
        image: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80",
        rating: 4.9,
        featured: true,
        amenities: ["Free WiFi", "Concierge", "Bar", "Room Service"],
        latitude: 48.8584,
        longitude: 2.2945
      }
    }),

    // Japan Hotels
    prisma.hotel.create({
      data: {
        name: "Tokyo Skytree Hotel",
        description: "Modern high-rise hotel with panoramic views of Tokyo's skyline.",
        cityId: cities[7].id,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80",
        rating: 4.7,
        featured: true,
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Sky Bar"],
        latitude: 35.7101,
        longitude: 139.8107
      }
    }),
  ])

  // Create rooms for each hotel
  for (const hotel of hotels) {
    const roomTypes = [
      { type: RoomType.SINGLE, total: 15, availabilityPercentage: 0.7 },
      { type: RoomType.DOUBLE, total: 20, availabilityPercentage: 0.8 },
      { type: RoomType.TWIN, total: 12, availabilityPercentage: 0.75 },
      { type: RoomType.SUITE, total: 8, availabilityPercentage: 0.9 },
      { type: RoomType.FAMILY, total: 10, availabilityPercentage: 0.85 },
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
        }
      })
    }
  }

  // Get all rooms for bookings
  const rooms = await prisma.room.findMany()

  // Create bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        hotelId: hotels[0].id,
        userId: users[0].id,
        roomId: rooms.find(r => r.hotelId === hotels[0].id && r.roomType === RoomType.DOUBLE)?.id,
        checkIn: new Date('2023-06-15'),
        checkOut: new Date('2023-06-20'),
        status: "confirmed"
      }
    }),
    prisma.booking.create({
      data: {
        hotelId: hotels[1].id,
        userId: users[1].id,
        roomId: rooms.find(r => r.hotelId === hotels[1].id && r.roomType === RoomType.SUITE)?.id,
        checkIn: new Date('2023-07-10'),
        checkOut: new Date('2023-07-15'),
        status: "confirmed"
      }
    }),
    prisma.booking.create({
      data: {
        hotelId: hotels[3].id,
        userId: users[2].id,
        roomId: rooms.find(r => r.hotelId === hotels[3].id && r.roomType === RoomType.FAMILY)?.id,
        checkIn: new Date('2023-08-05'),
        checkOut: new Date('2023-08-12'),
        status: "pending"
      }
    }),
  ])

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        hotelId: hotels[0].id,
        userId: users[0].id,
        rating: 5,
        comment: "Absolutely fantastic stay! The service was impeccable and the room was beautiful."
      }
    }),
    prisma.review.create({
      data: {
        hotelId: hotels[0].id,
        userId: users[1].id,
        rating: 4,
        comment: "Great location and comfortable rooms. Would definitely stay again."
      }
    }),
    prisma.review.create({
      data: {
        hotelId: hotels[1].id,
        userId: users[2].id,
        rating: 4.5,
        comment: "Amazing ocean views and very friendly staff. The pool area was perfect."
      }
    }),
    prisma.review.create({
      data: {
        hotelId: hotels[3].id,
        rating: 5,
        comment: "The most romantic hotel in Paris! Perfect for our anniversary trip."
      }
    }),
  ])

  // Create verification tokens (for testing)
  await prisma.verificationToken.create({
    data: {
      identifier: "test@example.com",
      token: "test-token-123",
      expires: new Date(Date.now() + 3600000) // 1 hour from now
    }
  })

  console.log('Database seeded successfully with images for countries and cities!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })