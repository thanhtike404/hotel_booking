import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: {
          include: {
            city: {
              include: {
                country: true
              }
            }
          }
        },
        bookings: {
          where: session.user.role === "ADMIN" ? {} : {
            userId: session.user.id
          },
          include: {
            user: session.user.role === "ADMIN" ? true : false
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room details:", error);
    return NextResponse.json(
      { error: "Failed to fetch room details" },
      { status: 500 }
    );
  }
}