import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, deleteNotification } from "@/services/notification";
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

export const useDeleteNotification = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications after successful deletion
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(userId)
      });
    },
    onError: (error) => {
      console.error("Error deleting notification:", error);
    }
  });
};
