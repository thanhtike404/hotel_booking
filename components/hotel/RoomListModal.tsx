'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Room {
  id: string
  roomType: string
  available: number
  capacity: number
  pricePerNight: number
}

interface RoomListModalProps {
  hotelId: string
  rooms: Room[]
}

export function RoomListModal({ hotelId, rooms }: RoomListModalProps) {
  const [open, setOpen] = useState(false)

  function formatRoomType(type: string) {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Rooms</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Available Rooms</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Price per Night</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{formatRoomType(room.roomType)}</TableCell>
                <TableCell>{room.capacity} guests</TableCell>
                <TableCell>{room.available} rooms</TableCell>
                <TableCell className="text-right">${room.pricePerNight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}