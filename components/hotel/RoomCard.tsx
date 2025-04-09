'use client'

import { Room } from '@/types/rooms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface RoomCardProps {
  room: Room & {
    image: string;
    price: number;
    amenities: string[];
  }
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={room.image}
          alt={`${room.roomType} room`}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{room.roomType}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={room.available > 0 ? 'default' : 'destructive'}>
            {room.available > 0 ? `${room.available} Available` : 'Fully Booked'}
          </Badge>
          <Badge variant="outline">${room.price}/night</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Rooms</span>
            <span>{room.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}