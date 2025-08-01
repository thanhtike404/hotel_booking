// WebSocket related types

export interface WebSocketMessage {
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

export interface NotificationMessage {
  action: string;
  userId: string;
  message: string;
  type?: string;
  data?: any;
}

export interface WebSocketNotificationPayload {
  action: string;
  userId: string;
  message: string;
  type?: string;
  data?: any;
}

export interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
}