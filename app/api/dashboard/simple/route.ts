import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simple stats
    const totalBookings = await prisma.booking.count();
    const totalUsers = await prisma.user.count();
    
    // Simple room data with fallbacks
    const rooms = await prisma.room.findMany({
      select: {
        available: true,
        total: true
      }
    });

    const totalRooms = rooms.reduce((sum, room) => sum + (room.total || 0), 0);
    const availableRooms = rooms.reduce((sum, room) => sum + (room.available || 0), 0);

    // Simple recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { 
          select: { 
            name: true, 
            email: true 
          } 
        }
      }
    });

    const formattedBookings = recentBookings.map((booking, index) => ({
      id: index + 1,
      guestName: booking.user.name || booking.user.email || 'Unknown Guest',
      roomType: 'Standard Room', // Simplified for now
      date: new Date(booking.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: booking.status === 'CONFIRMED' ? 'Confirmed' :
              booking.status === 'PENDING' ? 'Pending' :
              booking.status === 'CANCELLED' ? 'Cancelled' :
              'Other'
    }));

    // Simple room status
    const occupiedRooms = totalRooms - availableRooms;
    const occupiedPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const availablePercentage = totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0;

    const dashboardData = {
      stats: {
        bookings: {
          total: totalBookings,
          trend: { direction: 'up' as const, value: '8.5%' }
        },
        guests: {
          total: totalUsers,
          trend: { direction: 'up' as const, value: '12.3%' }
        },
        rooms: {
          available: availableRooms,
          total: totalRooms,
          trend: { direction: 'up' as const, value: '5.2%' }
        },
        revenue: {
          total: 25000, // Mock revenue
          trend: { direction: 'up' as const, value: '12.5%' }
        }
      },
      recentBookings: formattedBookings,
      roomStatus: [
        { type: "Occupied", percentage: occupiedPercentage },
        { type: "Available", percentage: availablePercentage },
        { type: "Under Maintenance", percentage: 5 },
        { type: "Reserved", percentage: 15 }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Simple dashboard API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard data", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}