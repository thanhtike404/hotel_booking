"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Room } from '@/types/hotel' // adjust path if needed
import { DataTable } from '@/components/dataTable/data-table'
import { columns } from './columns'

function Page() {
    const { hotelId } = useParams<{ hotelId: string }>()

    const fetchRoomsByHotelId = async (): Promise<{
        hotel: {
            name: string
            rooms: Room[]
        }
    }> => {
        const { data } = await axios.get(`/api/dashboard/hotels/${hotelId}/rooms`)
        return data.rooms
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['hotel-rooms', hotelId],
        queryFn: fetchRoomsByHotelId,
        enabled: !!hotelId, // only run if hotelId exists
    })
    console.log(data)
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading rooms.</div>

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Rooms</h1>
                    <p className="text-muted-foreground">Manage your Room listings</p>
                </div>

            </div>
            <DataTable columns={columns} data={data || []} />
        </div>)
}

export default Page
