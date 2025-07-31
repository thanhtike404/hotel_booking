import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authGuard } from "@/lib/authGuard";
import { z } from "zod";

const notificationSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    // Authentication check
    const session = await authGuard();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = notificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { userId, message } = validation.data;

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        notification,
        message: "Notification created successfully"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to send notification to all admin users
export async function sendNotificationToAdmins(message: string) {
  try {
    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: "ADMIN"
      },
      select: {
        id: true
      }
    });

    // Create notifications for all admin users
    const notifications = await Promise.all(
      adminUsers.map(admin => 
        prisma.notification.create({
          data: {
            userId: admin.id,
            message,
            isRead: false,
          },
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error("Error sending notifications to admins:", error);
    throw error;
  }
}