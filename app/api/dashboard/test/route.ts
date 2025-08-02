import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

    
    console.log("Testing database queries...");

    const bookingCount = await prisma.booking.count();
    console.log("Booking count:", bookingCount);

    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    const roomCount = await prisma.room.count();
    console.log("Room count:", roomCount);

    // Test room aggregation
    const roomData = await prisma.room.aggregate({
      _sum: { total: true, available: true }
    });
    console.log("Room data:", roomData);

    // Test recent bookings query
    const recentBookings = await prisma.booking.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        rooms: {
          include: {
            room: { select: { name: true, roomType: true } }
          }
        }
      }
    });
    console.log("Recent bookings:", recentBookings.length);

    return NextResponse.json({
      success: true,
      data: {
        bookingCount,
        userCount,
        roomCount,
        roomData,
        recentBookingsCount: recentBookings.length,
        session: {
          userId: session.user.id,
          role: session.user.role
        }
      }
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}