import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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


    return NextResponse.json(countries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}