import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Types for dashboard data
export interface DashboardStats {
  bookings: {
    total: number;
    trend: {
      direction: 'up' | 'down';
      value: string;
    };
  };
  guests: {
    total: number;
    trend: {
      direction: 'up' | 'down';
      value: string;
    };
  };
  rooms: {
    available: number;
    total: number;
    trend: {
      direction: 'up' | 'down';
      value: string;
    };
  };
  revenue: {
    total: number;
    trend: {
      direction: 'up' | 'down';
      value: string;
    };
  };
}

export interface DashboardBooking {
  id: number;
  guestName: string;
  roomType: string;
  date: string;
  status: string;
}

export interface RoomStatus {
  type: string;
  percentage: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentBookings: DashboardBooking[];
  roomStatus: RoomStatus[];
}

// Hook to fetch complete dashboard overview
export const useDashboardOverview = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/simple");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to fetch dashboard stats only
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/stats");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch recent bookings only
export const useDashboardRecentBookings = () => {
  return useQuery<DashboardBooking[]>({
    queryKey: ["dashboard-recent-bookings"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/recent-bookings");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for more frequent updates
  });
};

// Hook to fetch room status only
export const useDashboardRoomStatus = () => {
  return useQuery<RoomStatus[]>({
    queryKey: ["dashboard-room-status"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/room-status");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};