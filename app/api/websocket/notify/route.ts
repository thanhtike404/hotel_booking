import { NextResponse } from "next/server";
import { authGuard } from "@/lib/authGuard";
import { awsWebSocketService } from "@/services/awsWebSocket";

export async function POST(request: Request) {
  try {
    // Authentication check
    const session = await authGuard();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds, message, type, data } = body;

    if (!userIds || !Array.isArray(userIds) || !message) {
      return NextResponse.json(
        { error: "Invalid data: userIds array and message are required" },
        { status: 400 }
      );
    }

    // Send WebSocket notifications using the AWS WebSocket service
    const result = await awsWebSocketService.sendNotificationToUsers(userIds, {
      message,
      type: type || 'notification',
      data: data || {}
    });

    console.log(`✅ WebSocket notifications sent: ${result.success} success, ${result.failed} failed`);

    return NextResponse.json({
      success: true,
      message: `WebSocket notifications processed: ${result.success} sent, ${result.failed} failed`,
      results: result
    });

  } catch (error) {
    console.error("WebSocket notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}