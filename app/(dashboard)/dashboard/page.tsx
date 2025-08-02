"use client";

import { 
  Users, 
  Hotel, 
  Calendar, 
  DollarSign,
  Loader2 
} from "lucide-react";
import React from "react";
import { useDashboardOverview } from "@/hooks/dashboard/useDashboard";
import { Card, CardContent } from "@/components/ui/card";

interface CardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: {
    direction: 'up' | 'down';
    value: string;
  };
}

function StatsCard({ title, value, icon, trend }: CardProps) {
  const isPositive = trend.direction === 'up';
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {React.createElement(icon, { className: "h-6 w-6 text-primary" })}
        </div>
        <span className={`text-sm ${isPositive ? 'text-emerald-500' : 'text-destructive'}`}>
          {`${trend.direction === 'up' ? '+' : '-'}${trend.value}`}
        </span>
      </div>
      <h3 className="text-muted-foreground text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardOverview();

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-destructive">Failed to load dashboard data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : dashboardData ? (
          <>
            <StatsCard
              title="Total Bookings"
              value={dashboardData.stats.bookings.total.toLocaleString()}
              icon={Calendar}
              trend={dashboardData.stats.bookings.trend}
            />
            <StatsCard
              title="Total Guests"
              value={dashboardData.stats.guests.total.toLocaleString()}
              icon={Users}
              trend={dashboardData.stats.guests.trend}
            />
            <StatsCard
              title="Available Rooms"
              value={dashboardData.stats.rooms.available.toString()}
              icon={Hotel}
              trend={dashboardData.stats.rooms.trend}
            />
            <StatsCard
              title="Revenue"
              value={`$${dashboardData.stats.revenue.total.toLocaleString()}`}
              icon={DollarSign}
              trend={dashboardData.stats.revenue.trend}
            />
          </>
        ) : null}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Bookings</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div>
                    <p className="font-medium text-foreground">{booking.guestName}</p>
                    <p className="text-sm text-muted-foreground">{booking.roomType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{booking.date}</p>
                    <p className="text-sm text-muted-foreground">{booking.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent bookings</p>
            )}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Room Status</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : dashboardData?.roomStatus && dashboardData.roomStatus.length > 0 ? (
              dashboardData.roomStatus.map((status) => (
                <div key={status.type} className="flex items-center justify-between">
                  <span className="text-foreground">{status.type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{status.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No room status data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}