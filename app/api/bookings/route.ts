import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to make a booking" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hotelId, checkIn, checkOut, guests, roomId } = body;

    if (!hotelId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the room is available for the selected dates
    if (roomId) {
      const existingBookings = await prisma.booking.findMany({
        where: {
          roomId,
          OR: [
            {
              AND: [
                { checkIn: { lte: new Date(checkIn) } },
                { checkOut: { gte: new Date(checkIn) } },
              ],
            },
            {
              AND: [
                { checkIn: { lte: new Date(checkOut) } },
                { checkOut: { gte: new Date(checkOut) } },
              ],
            },
          ],
        },
      });

      if (existingBookings.length > 0) {
        return NextResponse.json(
          { error: "Room is not available for the selected dates" },
          { status: 400 }
        );
      }
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        hotelId,
        userId: user.id,
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: "PENDING",
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}