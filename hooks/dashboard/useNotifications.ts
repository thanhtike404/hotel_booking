import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/services/notification";
import { Notification } from "@prisma/client";
export const useNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  
}