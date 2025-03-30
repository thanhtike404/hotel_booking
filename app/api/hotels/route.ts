import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, location, description, image, rating, pricePerNight, featured, amenities } = await request.json();

    // Validate input
    if (!name || !location || !description || !image || rating === undefined || !pricePerNight || !amenities) {
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
        pricePerNight,
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

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}