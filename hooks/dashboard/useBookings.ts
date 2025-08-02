import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batchDeleteBookings } from "@/services/booking";
import axios from "axios";

export const bookingsQueryKey = ['bookings'];

export const useBookings = () => {
  const fetchBookings = async () => {
    const response = await axios.get("/api/dashboard/bookings");
    return response.data.bookings;
  };

  return useQuery({
    queryKey: bookingsQueryKey,
    queryFn: fetchBookings,
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