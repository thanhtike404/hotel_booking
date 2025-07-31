import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const notificationStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'ACCEPTED', 'REJECTED'])
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = notificationStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Update notification status
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { status },
      include: {
        booking: {
          include: {
            hotel: true,
            user: true
          }
        }
      }
    });

    // If this is a booking notification and status is being accepted/rejected,
    // also update the booking status accordingly
    if (updatedNotification.booking && (status === 'ACCEPTED' || status === 'REJECTED')) {
      const bookingStatus = status === 'ACCEPTED' ? 'CONFIRMED' : 'REJECTED';
      
      await prisma.booking.update({
        where: { id: updatedNotification.bookingId! },
        data: { status: bookingStatus }
      });
    }

    return NextResponse.json({
      success: true,
      notification: updatedNotification,
      message: `Notification status updated to ${status}`
    });

  } catch (error) {
    console.error("Error updating notification status:", error);
    return NextResponse.json(
      { error: "Failed to update notification status" },
      { status: 500 }
    );
  }
}