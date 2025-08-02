import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/bookings - Get all bookings for dashboard (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await authGuard();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status && status !== "all") {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        {
          hotel: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ];
    }

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              image: true,
              city: {
                select: {
                  name: true,
                  country: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          notifications: {
            select: {
              id: true,
              message: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/bookings - Delete multiple bookings (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await authGuard();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid booking IDs provided" },
        { status: 400 }
      );
    }

    // Delete the bookings
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedBookings.count} booking(s)`,
      deletedCount: deletedBookings.count
    });

  } catch (error) {
    console.error("Error deleting bookings:", error);
    return NextResponse.json(
      { error: "Failed to delete bookings" },
      { status: 500 }
    );
  }
}