import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    
    // Total bookings
    const totalBookings = await prisma.booking.count();
    
    // Total unique guests (users who have made bookings)
    const totalGuests = await prisma.user.count({
      where: { 
        bookings: { 
          some: {} 
        } 
      }
    });

    // Room statistics - handle potential null values
    const roomData = await prisma.room.aggregate({
      _sum: { total: true, available: true }
    });

    const totalRooms = roomData._sum.total || 0;
    const availableRooms = roomData._sum.available || 0;

    // Revenue calculation
    const confirmedBookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      include: {
        rooms: {
          include: { room: true }
        }
      }
    });

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      const bookingRevenue = booking.rooms.reduce((roomSum, bookingRoom) => {
        const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
        return roomSum + (bookingRoom.room.price * nights);
      }, 0);
      return sum + bookingRevenue;
    }, 0);

    // === RECENT BOOKINGS ===
    const recentBookingsData = await prisma.booking.findMany({
      take: 5,
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

    const recentBookings = recentBookingsData.map((booking, index) => ({
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

    // === ROOM STATUS ===
    const occupiedRooms = totalRooms - availableRooms;
    const today = new Date();
    const currentActiveBookings = await prisma.booking.count({
      where: {
        status: 'CONFIRMED',
        checkIn: { lte: today },
        checkOut: { gte: today }
      }
    });

    const occupiedPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const availablePercentage = totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0;
    const maintenancePercentage = 5; // Mock data
    const reservedPercentage = Math.min(15, Math.round((currentActiveBookings / totalRooms) * 100));

    const roomStatus = [
      { type: "Occupied", percentage: occupiedPercentage },
      { type: "Available", percentage: availablePercentage },
      { type: "Under Maintenance", percentage: maintenancePercentage },
      { type: "Reserved", percentage: reservedPercentage }
    ];

    // === COMBINED RESPONSE ===
    const dashboardData = {
      stats: {
        bookings: {
          total: totalBookings,
          trend: {
            direction: 'up' as const,
            value: '8.5%'
          }
        },
        guests: {
          total: totalGuests,
          trend: {
            direction: 'up' as const,
            value: '12.3%'
          }
        },
        rooms: {
          available: availableRooms,
          total: totalRooms,
          trend: {
            direction: 'up' as const,
            value: '5.2%'
          }
        },
        revenue: {
          total: Math.round(totalRevenue),
          trend: {
            direction: 'up' as const,
            value: '12.5%'
          }
        }
      },
      recentBookings,
      roomStatus
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard overview" },
      { status: 500 }
    );
  }
}