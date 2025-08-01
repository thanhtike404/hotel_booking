"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { notificationsQueryKey } from "@/hooks/dashboard/useNotifications";
import { saveNotification, saveNotificationToAdmins } from "@/services/notification";

interface WebSocketContextType {
  sendNotification: (payload: Record<string, any>) => void;
  isConnected: boolean;
  connectionState: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const queryClientRef = useRef(queryClient);
  const { data: session, status } = useSession();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("disconnected");

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  // Keep query client ref updated
  useEffect(() => {
    queryClientRef.current = queryClient;
  }, [queryClient]);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    // Don't connect if already connected or connecting
    if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
      console.log("[WebSocket] Already connected or connecting, skipping");
      return;
    }

    if (!session?.user?.id || status !== "authenticated") {
      console.log("[WebSocket] Not authenticated, skipping connection");
      return;
    }

    // Validate WebSocket URL
    const wsUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL;
    if (!wsUrl) {
      console.warn("[WebSocket] NEXT_PUBLIC_WEB_SOCKET_URL is not defined");
      setConnectionState("error: missing URL");
      return;
    }

    const fullWsUrl = `${wsUrl}?userId=${session.user.id}`;
    console.log("[WebSocket] Connecting to:", fullWsUrl);

    try {
      setConnectionState("connecting");
      ws.current = new WebSocket(fullWsUrl);

      ws.current.onopen = () => {
        console.log("🔌 WebSocket connected");
        setIsConnected(true);
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0; // Reset reconnection attempts
      };
   


      ws.current.onmessage = (event) => {
        console.log(event,' web socekt connection event')
        try {
          const data = JSON.parse(event.data);
          console.log("📩 WS Message:", data);

          if (data.action === "sendNotification") {
            queryClientRef.current.setQueryData(notificationsQueryKey(session.user.id), (old: any[] = []) => [
              data,
              ...(old ?? []),
            ]);
          }
        } catch (err) {
          console.warn("❌ Failed to parse WebSocket message:", event.data, err);
        }
      };

      ws.current.onerror = (event) => {
        // Use console.warn instead of console.error to avoid Next.js error boundaries
        console.warn("❌ WebSocket error occurred");
        console.warn("❌ WebSocket error details:", {
          type: event.type,
          timeStamp: event.timeStamp,
          readyState: ws.current?.readyState,
          url: ws.current?.url,
        });
        setConnectionState("error");
      };

      ws.current.onclose = (event) => {
        console.warn("🔌 WebSocket closed:", {
          code: event.code,
          reason: event.reason || "No reason provided",
          wasClean: event.wasClean,
        });
        
        setIsConnected(false);
        setConnectionState(`closed (${event.code})`);

        // Attempt to reconnect if it wasn't a clean close
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`🔄 Attempting to reconnect... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          console.warn("❌ Max reconnection attempts reached");
          setConnectionState("failed");
        }
      };

    } catch (error) {
      console.warn("❌ Failed to create WebSocket connection:", error);
      setConnectionState("error: failed to create");
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    // Only connect if we have a user ID and are authenticated
    if (session?.user?.id && status === "authenticated") {
      connect();
    }
    
    return cleanup;
  }, [session?.user?.id, status, connect, cleanup]);

  const sendNotification = useCallback(async (payload: Record<string, any>) => {
    // Determine if this is a booking notification that should go to admins
    const isBookingNotification = payload.type === 'booking' || payload.bookingId;
    
    try {
      console.log("💾 Saving notification to database:", payload);
      
      if (isBookingNotification) {
        // Send to all admin users for booking notifications
        console.log("📢 Sending booking notification to all admins");
        await saveNotificationToAdmins({
          message: payload.message || '',
          action: payload.action,
          bookingId: payload.bookingId,
          status: payload.status,
          type: payload.type,
          data: payload.data
        });
        console.log("✅ Booking notification saved to all admins successfully");
      } else {
        // Send to specific user for regular notifications
        await saveNotification({
          userId: payload.userId || session?.user?.id || '',
          message: payload.message || '',
          action: payload.action,
          bookingId: payload.bookingId,
          status: payload.status,
          type: payload.type,
          data: payload.data
        });
        console.log("✅ Notification saved to database successfully");
        
        // Update local query cache for regular notifications
        if (session?.user?.id) {
          queryClientRef.current.setQueryData(notificationsQueryKey(session.user.id), (old: any[] = []) => [
            {
              id: `temp_${Date.now()}`,
              userId: payload.userId || session.user.id,
              message: payload.message,
              bookingId: payload.bookingId,
              status: payload.status,
              isRead: false,
              createdAt: new Date().toISOString(),
              ...payload
            },
            ...(old ?? []),
          ]);
        }
      }
    } catch (error) {
      console.error("❌ Failed to save notification to database:", error);
    }

    // Send via WebSocket (if connected)
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("📤 Sending via WebSocket:", payload);
      try {
        ws.current.send(JSON.stringify(payload));
      } catch (error) {
        console.warn("❌ Failed to send WebSocket message:", error);
      }
    } else {
      console.warn("⚠️ WebSocket not connected. Message not sent via WebSocket. State:", ws.current?.readyState);
      console.warn("⚠️ WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3");
    }
  }, [session?.user?.id]);

  // Don't render context for unauthenticated users
  if (status === "loading" || status === "unauthenticated") {
    return <>{children}</>;
  }

  return (
    <WebSocketContext.Provider value={{ 
      sendNotification, 
      isConnected, 
      connectionState 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("❌ useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};