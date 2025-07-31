import { NextResponse } from "next/server";
import { awsWebSocketService } from "@/services/awsWebSocket";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, connectionId, action } = body;

        if (!userId || !connectionId) {
            return NextResponse.json(
                { error: "userId and connectionId are required" },
                { status: 400 }
            );
        }

        if (action === 'connect') {
            // Store the connection
            awsWebSocketService.storeUserConnection(userId, connectionId);
            console.log(`🔌 User ${userId} connected with connection ID: ${connectionId}`);

            return NextResponse.json({
                success: true,
                message: "Connection stored successfully"
            });
        } else if (action === 'disconnect') {
            // Remove the connection
            awsWebSocketService.removeUserConnection(userId);
            console.log(`🔌 User ${userId} disconnected`);

            return NextResponse.json({
                success: true,
                message: "Connection removed successfully"
            });
        }

        return NextResponse.json(
            { error: "Invalid action. Use 'connect' or 'disconnect'" },
            { status: 400 }
        );

    } catch (error) {
        console.error("WebSocket connection management error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}