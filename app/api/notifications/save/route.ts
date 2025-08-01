import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saveNotificationSchema = z.object({
    userId: z.string().min(1),
    message: z.string().min(1),
    action: z.string().optional(),
    bookingId: z.string().optional(),
    status: z.enum(['REQUESTED', 'ACCEPTED', 'REJECTED']).optional(),
    type: z.string().optional(),
    data: z.any().optional()
});

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = saveNotificationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: validation.error.errors },
                { status: 400 }
            );
        }

        const { userId, message, bookingId, status } = validation.data;

        // Save notification to database
        const notification = await prisma.notification.create({
            data: {
                userId,
                message,
                bookingId,
                status,
                isRead: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                booking: {
                    select: {
                        id: true,
                        status: true,
                        hotel: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        console.log("✅ Notification saved to database:", notification);

        return NextResponse.json({
            success: true,
            notification,
            message: "Notification saved successfully"
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Error saving notification:", error);
        return NextResponse.json(
            { error: "Failed to save notification" },
            { status: 500 }
        );
    }
}