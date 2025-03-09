import { 
  Users, 
  Hotel, 
  Calendar, 
  DollarSign 
} from "lucide-react";
import React from "react";
import { Booking, RoomStatus } from "@/types/dashboard";

const recentBookings: Booking[] = [
  {
    id: 1,
    guestName: "John Doe",
    roomType: "Deluxe Suite",
    date: "Mar 15, 2024",
    status: "Confirmed"
  },
  {
    id: 2,
    guestName: "Jane Smith",
    roomType: "Standard Room",
    date: "Mar 14, 2024",
    status: "Checked In"
  },
  {
    id: 3,
    guestName: "Mike Johnson",
    roomType: "Executive Suite",
    date: "Mar 14, 2024",
    status: "Pending"
  }
];

const roomStatus: RoomStatus[] = [
  { type: "Occupied", percentage: 75 },
  { type: "Available", percentage: 25 },
  { type: "Under Maintenance", percentage: 10 },
  { type: "Reserved", percentage: 45 }
];

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value="1,234"
          icon={Calendar}
          trend={{ direction: 'up', value: '12.5%' }}
        />
        <StatsCard
          title="Total Guests"
          value="5,678"
          icon={Users}
          trend={{ direction: 'up', value: '8.2%' }}
        />
        <StatsCard
          title="Available Rooms"
          value="45"
          icon={Hotel}
          trend={{ direction: 'down', value: '3.1%' }}
        />
        <StatsCard
          title="Revenue"
          value="$52,389"
          icon={DollarSign}
          trend={{ direction: 'up', value: '15.3%' }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-foreground">{booking.guestName}</p>
                  <p className="text-sm text-muted-foreground">{booking.roomType}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{booking.date}</p>
                  <p className="text-sm text-muted-foreground">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Room Status</h2>
          <div className="space-y-4">
            {roomStatus.map((status) => (
              <div key={status.type} className="flex items-center justify-between">
                <span className="text-foreground">{status.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{status.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}