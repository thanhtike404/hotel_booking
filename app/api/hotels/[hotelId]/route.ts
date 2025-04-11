import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = await params;

    if (!hotelId) {
      return NextResponse.json({ error: "Missing hotel ID" }, { status: 400 });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        city: {
          include: {
            country: true,
          },
        },
        rooms: true,
        reviews: true,
        bookings: true,
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}