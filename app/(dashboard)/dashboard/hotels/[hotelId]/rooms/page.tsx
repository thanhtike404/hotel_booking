"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Room, RoomResponse } from "@/types/rooms"

import { DataTable } from '@/components/dataTable/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
function Page() {
    const { hotelId } = useParams<{ hotelId: string }>()




    const fetchRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
        const { data } = await axios.get<RoomResponse>(`/api/dashboard/hotels/${hotelId}/rooms`);
        return data.rooms;
    };


    const { data, isLoading, error } = useQuery({
        queryKey: ['hotel-rooms', hotelId],
        queryFn: () => fetchRoomsByHotelId(hotelId),
        enabled: !!hotelId,
    });

    console.log(data)
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading rooms.</div>

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {data?.[0]?.hotel?.name}
                    </h1>
                    <p className="text-muted-foreground">Manage your Room listings</p>
                </div>
                <Button>
                    <a href={`/dashboard/rooms/create`}>Add Room</a>
                </Button>
            </div>
            <DataTable columns={columns} data={data || []} />
        </div>)
}

export default Page
