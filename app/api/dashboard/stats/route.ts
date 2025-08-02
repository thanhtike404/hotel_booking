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

    // Get current date and previous month for comparison
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total bookings
    const totalBookings = await prisma.booking.count();
    const currentMonthBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: currentMonth
        }
      }
    });
    const previousMonthBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    });

    // Calculate booking trend
    const bookingTrend = previousMonthBookings > 0 
      ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings * 100)
      : 100;

    // Total unique guests (users who have made bookings)
    const totalGuests = await prisma.user.count({
      where: {
        bookings: {
          some: {}
        }
      }
    });
    const currentMonthGuests = await prisma.user.count({
      where: {
        bookings: {
          some: {
            createdAt: {
              gte: currentMonth
            }
          }
        }
      }
    });
    const previousMonthGuests = await prisma.user.count({
      where: {
        bookings: {
          some: {
            createdAt: {
              gte: previousMonth,
              lt: currentMonth
            }
          }
        }
      }
    });

    const guestTrend = previousMonthGuests > 0 
      ? ((currentMonthGuests - previousMonthGuests) / previousMonthGuests * 100)
      : 100;

    // Available rooms
    const totalRooms = await prisma.room.aggregate({
      _sum: {
        total: true
      }
    });
    const availableRooms = await prisma.room.aggregate({
      _sum: {
        available: true
      }
    });

    const roomTrend = 5.2; // Mock trend for available rooms

    // Revenue calculation (mock calculation based on bookings)
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED'
      },
      include: {
        rooms: {
          include: {
            room: true
          }
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

    const revenueTrend = 12.5; // Mock trend for revenue

    const stats = {
      bookings: {
        total: totalBookings,
        trend: {
          direction: bookingTrend >= 0 ? 'up' : 'down',
          value: `${Math.abs(bookingTrend).toFixed(1)}%`
        }
      },
      guests: {
        total: totalGuests,
        trend: {
          direction: guestTrend >= 0 ? 'up' : 'down',
          value: `${Math.abs(guestTrend).toFixed(1)}%`
        }
      },
      rooms: {
        available: availableRooms._sum.available || 0,
        total: totalRooms._sum.total || 0,
        trend: {
          direction: 'up',
          value: `${roomTrend}%`
        }
      },
      revenue: {
        total: Math.round(totalRevenue),
        trend: {
          direction: 'up',
          value: `${revenueTrend}%`
        }
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}