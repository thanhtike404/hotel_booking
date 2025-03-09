import { 
  Users, 
  Hotel, 
  Calendar, 
  DollarSign 
} from "lucide-react";

const recentBookings = [
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

const roomStatus = [
  { type: "Occupied", percentage: 75 },
  { type: "Available", percentage: 25 },
  { type: "Under Maintenance", percentage: 10 },
  { type: "Reserved", percentage: 45 }
];

function StatsCard({ title, value, icon, trend }) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-semibold dark:text-white">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value="1,234"
          icon={<Calendar className="h-6 w-6" />}
          trend="+12.5%"
        />
        <StatsCard
          title="Total Guests"
          value="5,678"
          icon={<Users className="h-6 w-6" />}
          trend="+8.2%"
        />
        <StatsCard
          title="Available Rooms"
          value="45"
          icon={<Hotel className="h-6 w-6" />}
          trend="-3.1%"
        />
        <StatsCard
          title="Revenue"
          value="$52,389"
          icon={<DollarSign className="h-6 w-6" />}
          trend="+15.3%"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                <div>
                  <p className="font-medium dark:text-white">{booking.guestName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{booking.roomType}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">{booking.date}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Room Status</h2>
          <div className="space-y-4">
            {roomStatus.map((status) => (
              <div key={status.type} className="flex items-center justify-between">
                <span className="dark:text-white">{status.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm dark:text-gray-400">{status.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}