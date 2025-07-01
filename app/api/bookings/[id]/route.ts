import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/types/bookings";
import { prisma } from "@/lib/prisma";
export const GET= async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } =await params;
  try {
    const bookingRoom = await prisma.bookingRoom.findUnique({
      where: {
        id: id,
        },
      include: {
        booking: true,
        room: true,
      },
    });

    return NextResponse.json(bookingRoom);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}