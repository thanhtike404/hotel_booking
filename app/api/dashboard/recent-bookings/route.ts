import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent bookings with user and room information
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        rooms: {
          include: {
            room: {
              select: {
                name: true,
                roomType: true
              }
            }
          }
        }
      }
    });

    // Transform the data to match the expected format
    const transformedBookings = recentBookings.map((booking, index) => ({
      id: index + 1,
      guestName: booking.user.name || booking.user.email || 'Unknown Guest',
      roomType: booking.rooms[0]?.room.name || booking.rooms[0]?.room.roomType || 'Unknown Room',
      date: new Date(booking.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: booking.status === 'CONFIRMED' ? 'Confirmed' :
              booking.status === 'PENDING' ? 'Pending' :
              booking.status === 'CANCELLED' ? 'Cancelled' :
              booking.status === 'COMPLETED' ? 'Checked In' :
              booking.status
    }));

    return NextResponse.json(transformedBookings);
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent bookings" },
      { status: 500 }
    );
  }
}