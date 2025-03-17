import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log('Fetching hotels...')  // Add logging
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: true,
        reviews: true,
        bookings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!hotels) {
      return NextResponse.json(
        { error: 'No hotels found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ hotels }, { status: 200 })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        image: body.image,
        rating: body.rating,
        pricePerNight: body.pricePerNight,
        featured: body.featured,
        amenities: body.amenities,
      },
    })

    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}