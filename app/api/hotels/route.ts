import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, cityId, description, image, rating, featured, amenities } = await request.json();

    // Validate input
    if (!name || !cityId || !description || !image || rating === undefined || !amenities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new hotel
    const newHotel = await prisma.hotel.create({
      data: {
        latitude: 0,
        longitude: 0,
        name,
        cityId,
        description,
        image,
        rating,
        featured,
        amenities,
      },
    });

    return NextResponse.json(newHotel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const search = searchParams.get("search") || undefined;
    const cityId = searchParams.get("city") || undefined;
    const rating = searchParams.get("rating") || undefined;
    const countryId = searchParams.get("country") || undefined;

    const filters: any = {};

    if (search) {
      filters.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (countryId) {
      filters.city = {
        country: {
          id: countryId,
        },
      };
    }

    if (rating) {
      filters.rating = {
        gte: parseFloat(rating),
      };
    }

    if (cityId) {
      filters.city = {
        id: cityId,
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
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}