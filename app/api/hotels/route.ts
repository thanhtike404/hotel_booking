import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, location, description, image, rating, featured, amenities } = await request.json();

    // Validate input
    if (!name || !location || !description || !image || rating === undefined || !amenities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new hotel
    const newHotel = await prisma.hotel.create({
      data: {
        name,
        location,
        description,
        image,
        rating,

        featured,
        amenities,
      },
    });

    return NextResponse.json(newHotel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    });

    if (!hotels) {
      return NextResponse.json({ error: 'No hotels found' }, { status: 404 });
    }

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}