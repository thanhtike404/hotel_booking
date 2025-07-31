import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, deleteNotification, updateNotificationStatus } from "@/services/notification";
import { Notification } from "@prisma/client";
export const notificationsQueryKey = (userId: string) => ['notifications', userId];

export const useNotifications = (userId: string | undefined) => {
  return useQuery<Notification[]>({
    queryKey: notificationsQueryKey(userId || ''),
    queryFn: () => getNotifications(userId!),
    enabled: !!userId && userId.trim() !== '', // Only run query if userId is available and not empty
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
export const useUpdateNotificationStatus = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId, status }: {
      notificationId: string;
      status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED'
    }) => updateNotificationStatus(notificationId, status),
    onSuccess: () => {
      // Invalidate and refetch notifications after successful status update
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(userId)
      });
    },
    onError: (error) => {
      console.error("Error updating notification status:", error);
    }
  });
};