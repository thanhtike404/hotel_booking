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

        // Get room statistics
        const totalRoomsData = await prisma.room.aggregate({
            _sum: {
                total: true,
                available: true
            }
        });

        const totalRooms = totalRoomsData._sum.total || 0;
        const availableRooms = totalRoomsData._sum.available || 0;
        const occupiedRooms = totalRooms - availableRooms;

        // Get current bookings to calculate occupied rooms more accurately
        const today = new Date();
        const currentBookings = await prisma.booking.count({
            where: {
                status: 'CONFIRMED',
                checkIn: {
                    lte: today
                },
                checkOut: {
                    gte: today
                }
            }
        });

        // Calculate percentages
        const occupiedPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
        const availablePercentage = totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0;

        // Mock data for maintenance and reserved (you can implement actual logic later)
        const maintenancePercentage = 5; // Mock 5% under maintenance
        const reservedPercentage = Math.min(15, Math.round((currentBookings / totalRooms) * 100)); // Reserved rooms

        const roomStatus = [
            {
                type: "Occupied",
                percentage: occupiedPercentage
            },
            {
                type: "Available",
                percentage: availablePercentage
            },
            {
                type: "Under Maintenance",
                percentage: maintenancePercentage
            },
            {
                type: "Reserved",
                percentage: reservedPercentage
            }
        ];

        return NextResponse.json(roomStatus);
    } catch (error) {
        console.error("Error fetching room status:", error);
        return NextResponse.json(
            { error: "Failed to fetch room status" },
            { status: 500 }
        );
    }
}