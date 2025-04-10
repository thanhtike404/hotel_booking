import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      include: {
        cities: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedCountries = countries.map(country => ({
      name: country.name,
      cities: country.cities.map(city => city.name)
    }));

    return NextResponse.json(formattedCountries);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}