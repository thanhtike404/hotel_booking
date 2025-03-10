export const dashboardData = {
  stats: {
    bookings: {
      total: 5678,
      trend: { direction: 'up', value: '12.5%' }
    },
    guests: {
      total: 1234,
      trend: { direction: 'up', value: '8.2%' }
    },
    rooms: {
      available: 45,
      trend: { direction: 'down', value: '3.1%' }
    },
    revenue: {
      total: 52389,
      trend: { direction: 'up', value: '15.3%' }
    }
  },
  recentBookings: [
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
  ],
  roomStatus: [
    { type: "Occupied", percentage: 75 },
    { type: "Available", percentage: 25 },
    { type: "Under Maintenance", percentage: 10 },
    { type: "Reserved", percentage: 45 }
  ]
};