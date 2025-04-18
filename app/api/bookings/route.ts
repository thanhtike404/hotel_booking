import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authGuard } from "@/lib/authGuard";

export async function POST(request: Request) {
  try {
    const session = await authGuard();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const email = session?.user?.email;
    if (!email)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { hotelId, checkIn, checkOut, guests, roomId } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!hotelId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
          { status: 400 },
        );
      }
    }

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
      { status: 500 },
    );
  }
}
export const GET = async () => {
  try {
    const session = await authGuard();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookings = await prisma.booking.findMany({
      include: {
        hotel: true,
        user: true,
        _count: {
          select: { rooms: true },
        },
      },
    });
    if (!bookings) {
      return NextResponse.json(bookings);
    }
    return NextResponse.json({ bookings });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
};
