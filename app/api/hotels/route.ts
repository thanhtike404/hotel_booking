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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const search = searchParams.get("search") || undefined;
    const city = searchParams.get("city") || undefined;
    const country = searchParams.get("country") || undefined;
    const rating = searchParams.get("rating") || undefined;

    const filters: any = {};

    if (search) {
      filters.name = { contains: search, mode: 'insensitive' };
    }

    if (rating) {
      filters.rating = {
        gte: parseFloat(rating),
      };
    }

    if (city) {
      filters.city = {
        name: {
          equals: city,
          mode: 'insensitive',
        },
      };
    }

    if (country) {
      filters.city = {
        ...(filters.city || {}),
        country: {
          name: {
            equals: country,
            mode: 'insensitive',
          },
        },
      };
    }

    const hotels = await prisma.hotel.findMany({
      where: filters,
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json({ hotels }, { status: 200 });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
