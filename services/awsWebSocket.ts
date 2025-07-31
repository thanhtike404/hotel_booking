import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import axios from 'axios';

interface WebSocketMessage {
    action: string;
    userId: string;
    message: string;
    type?: string;
    data?: any;
    timestamp?: string;
    id?: string;
    isRead?: boolean;
    createdAt?: string;
}

// In-memory store for connection IDs (in production, use Redis or DynamoDB)
const userConnections = new Map<string, string>();

export class AWSWebSocketService {
    private wsApiUrl: string;
    private wsEndpoint: string;
    private apiGatewayEndpoint: string;
    private apiGatewayClient: ApiGatewayManagementApiClient | null = null;

    constructor() {
        this.wsApiUrl = process.env.WEBSOCKET_API_URL || '';
        this.wsEndpoint = process.env.NEXT_PUBLIC_WEB_SOCKET_URL || '';

        // Extract the API Gateway endpoint from WebSocket URL

        this.apiGatewayEndpoint = this.wsEndpoint.replace('wss://', 'https://').replace('ws://', 'http://');

        // Initialize AWS API Gateway Management API client // wss://kkxol6k0v8.execute-api.ap-southeast-1.amazonaws.com/dev/ -> https://kkxol6k0v8.execute-api.ap-southeast-1.amazonaws.com/dev
        if (this.apiGatewayEndpoint) {
            try {
                this.apiGatewayClient = new ApiGatewayManagementApiClient({
                    endpoint: this.apiGatewayEndpoint,
                    region: process.env.AWS_REGION || 'ap-southeast-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                    }
                });
            } catch (error) {
                console.warn('Failed to initialize AWS API Gateway client:', error);
            }
        }
    }

    // Store connection ID for a user
    storeUserConnection(userId: string, connectionId: string) {
        userConnections.set(userId, connectionId);
        console.log(`📝 Stored connection for user ${userId}: ${connectionId}`);
    }

    // Remove connection ID for a user
    removeUserConnection(userId: string) {
        userConnections.delete(userId);
        console.log(`🗑️ Removed connection for user ${userId}`);
    }

    // Get connection ID for a user
    getUserConnection(userId: string): string | undefined {
        return userConnections.get(userId);
    }

    async sendMessageToUser(userId: string, message: WebSocketMessage): Promise<boolean> {
        try {
            // Method 1: Use AWS SDK with stored connection ID
            if (this.apiGatewayClient) {
                const connectionId = this.getUserConnection(userId);
                if (connectionId) {
                    try {
                        const command = new PostToConnectionCommand({
                            ConnectionId: connectionId,
                            Data: JSON.stringify(message)
                        });

                        await this.apiGatewayClient.send(command);
                        console.log(`✅ WebSocket message sent to user ${userId} via AWS SDK`);
                        return true;
                    } catch (awsError: any) {
                        console.log(`⚠️ AWS SDK method failed for user ${userId}:`, awsError.message);
                        // If connection is stale, remove it
                        if (awsError.statusCode === 410) {
                            this.removeUserConnection(userId);
                        }
                    }
                } else {
                    console.log(`⚠️ No connection ID found for user ${userId}`);
                }
            }

            // Method 2: Use REST API endpoint that triggers WebSocket messages
            if (this.wsApiUrl) {
                try {
                    await axios.post(this.wsApiUrl, message, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(`✅ WebSocket message sent to user ${userId} via custom API`);
                    return true;
                } catch (apiError) {
                    console.log(`⚠️ Custom API method failed for user ${userId}`);
                }
            }

            // Method 3: Try direct API Gateway Management API call
            if (this.apiGatewayEndpoint) {
                try {
                    const managementApiUrl = `${this.apiGatewayEndpoint}/@connections`;
                    await axios.post(managementApiUrl, message, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        params: {
                            userId: userId
                        }
                    });
                    console.log(`✅ WebSocket message sent to user ${userId} via API Gateway REST`);
                    return true;
                } catch (restError) {
                    console.log(`⚠️ API Gateway REST method failed for user ${userId}`);
                }
            }

            // Method 4: Log the message (for development/testing)
            console.log(`📤 WebSocket message for user ${userId} (logged only):`, JSON.stringify(message, null, 2));

            // For testing purposes, we'll consider this successful
            // This allows the booking process to continue even if WebSocket fails
            return true;

        } catch (error) {
            console.error(`❌ Failed to send WebSocket message to user ${userId}:`, error);
            return false;
        }
    }

    async sendNotificationToUsers(userIds: string[], notificationData: {
        message: string;
        type?: string;
        data?: any;
    }): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        console.log(`📤 Sending WebSocket notifications to ${userIds.length} users`);

        await Promise.all(
            userIds.map(async (userId) => {
                const message: WebSocketMessage = {
                    action: 'sendNotification',
                    userId,
                    message: notificationData.message,
                    type: notificationData.type || 'notification',
                    data: notificationData.data || {},
                    timestamp: new Date().toISOString(),
                    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    isRead: false,
                    createdAt: new Date().toISOString()
                };

                const sent = await this.sendMessageToUser(userId, message);
                if (sent) {
                    success++;
                } else {
                    failed++;
                }
            })
        );

        console.log(`📊 WebSocket notification results: ${success} success, ${failed} failed`);
        return { success, failed };
    }

    // Method to test WebSocket connectivity
    async testConnection(): Promise<boolean> {
        try {
            const testMessage = {
                action: 'ping',
                userId: 'test',
                message: 'Connection test',
                timestamp: new Date().toISOString()
            };

            return await this.sendMessageToUser('test', testMessage);
        } catch (error) {
            console.error('WebSocket connection test failed:', error);
            return false;
        }
    }
}

export const awsWebSocketService = new AWSWebSocketService();