import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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
    
    if (!body.name || !body.location || !body.description || !body.image || body.rating === undefined || !body.pricePerNight || !body.amenities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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

    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
    }

    await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Hotel deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 });
  }
}