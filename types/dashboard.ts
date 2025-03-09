export interface CardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: {
    direction: 'up' | 'down';
    value: string;
  };
}

export interface Booking {
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