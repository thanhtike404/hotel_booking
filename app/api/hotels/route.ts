import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, cityId, description, image, rating, featured, amenities, latitude, longitude } = await request.json();

    // Validate input
    if (!name || !cityId || !description || !image || rating === undefined || !amenities || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new hotel
    const newHotel = await prisma.hotel.create({
      data: {
        name,
        cityId,
        description,
        image,
        rating,
        featured: featured || false,
        amenities,
        latitude,
        longitude
      },
    });

    return NextResponse.json(newHotel, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: true,
        reviews: true,
        bookings: true,
        city: {
          include: {
            country: true
          }
        }
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