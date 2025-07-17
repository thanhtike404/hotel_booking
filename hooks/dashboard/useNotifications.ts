import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification";
import { Notification } from "@prisma/client";

export const notificationsQueryKey = (userId: string) => ['notifications', userId];

export const useNotifications = (userId: string) => {
  return useQuery<Notification[]>({
    queryKey: notificationsQueryKey(userId),
    queryFn: () => getNotifications(userId),
    enabled: !!userId, // Only run query if userId is available
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
