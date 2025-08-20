import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batchDeleteBookings } from "@/services/booking";
import axios from "axios";

export const bookingsQueryKey = ['/dashboard/bookings'];


interface BookingsFilters {
  page?: number;
  limit?: number;
  userId?: string;
  hotelId?: string;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
  status?: string;
}

export const useBookings = (filters: BookingsFilters = {}) => {
  const fetchBookings = async () => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.hotelId) params.append("hotelId", filters.hotelId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.status) params.append("status", filters.status);

    const response = await axios.get(`/api/dashboard/bookings?${params.toString()}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["bookings", filters], // include filters so the query updates when they change
    queryFn: fetchBookings,
    staleTime: 5 * 60 * 1000, // optional, 5 minutes
  });
};

export const useBatchDeleteBookings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchDeleteBookings,
    onSuccess: (data) => {
      // Invalidate and refetch bookings after successful deletion
      queryClient.invalidateQueries({
        queryKey: bookingsQueryKey
      });
      console.log(`Successfully deleted ${data.deletedCount} booking(s)`);
    },
    onError: (error) => {
      console.error("Error batch deleting bookings:", error);
    }
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const response = await axios.patch(`/api/dashboard/bookings/${bookingId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings after successful update
      queryClient.invalidateQueries({
        queryKey: bookingsQueryKey
      });
    },
    onError: (error) => {
      console.error("Error updating booking status:", error);
    }
  });
};