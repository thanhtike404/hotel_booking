import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authGuard } from "@/lib/authGuard";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const bookingSchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Authentication check
    const session = await authGuard();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = bookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { hotelId, roomId, checkIn, checkOut } = validation.data;
    const userId = session.user.id; // Now properly getting userId

    // 3. Verify room exists
    const roomExists = await prisma.room.findUnique({
      where: { id: roomId, hotelId },
      select: { id: true },
    });

    if (!roomExists) {
      return NextResponse.json(
        { error: "Room not found in specified hotel" },
        { status: 404 }
      );
    }


    const booking = await prisma.booking.create({
      data: {
        hotelId,
        userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: "PENDING",
      },
    });


    await prisma.bookingRoom.create({
      data: {
        bookingId: booking.id,
        roomId,
      },
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        bookingId: booking.id,
        message: "Booking created successfully"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking creation error:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Unique constraint violation" },
          { status: 400 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Referenced record not found" },
          { status: 404 }
        );
      }
    }

    // Fallback error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
