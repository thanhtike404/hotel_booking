import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const roomsQueryKey = ['dashboard', 'rooms'];

import { RoomsFilters } from '@/types/ui';


export const useRooms = (filters: RoomsFilters = {}) => {
  const fetchRooms = async () => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.name) params.append('name', filters.name);
    if (filters.hotelId) params.append('hotelId', filters.hotelId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.available !== undefined) params.append('available', filters.available.toString());

    const response = await axios.get(`/api/dashboard/rooms?${params.toString()}`);
    return response.data;
  };

  return useQuery({
    queryKey: [...roomsQueryKey, filters],
    queryFn: fetchRooms,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBatchDeleteRooms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomIds: string[]) => {
      const response = await axios.delete('/api/dashboard/rooms', {
        data: { ids: roomIds }
      });
      return response.data;
    },
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: roomsQueryKey
      });
    },
    onError: (error) => {
      console.error("Error batch deleting rooms:", error);
    }
  });
};


export const useHotelsForFilter = () => {
  const fetchHotels = async () => {
    const response = await axios.get('/api/hotels');
    return response.data.hotels || [];
  };

  return useQuery({
    queryKey: ['hotels', 'filter'],
    queryFn: fetchHotels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};