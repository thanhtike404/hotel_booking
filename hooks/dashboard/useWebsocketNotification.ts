// hooks/useWebSocketNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationsQueryKey } from "./useNotifications";
import { useSession } from "next-auth/react";

export function useWebSocketNotifications() {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?userId=${session.user.id}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("🔌 WebSocket connected");
    };

  ws.current.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received WS message:", data);

  if (data.action === "sendNotification") {
    console.log("New notification received:", data);
    queryClient.setQueryData(notificationsQueryKey, (old = []) => [
      data,
      ...old,
    ]);
  }
};


    ws.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [session?.user?.id, queryClient]);
}
