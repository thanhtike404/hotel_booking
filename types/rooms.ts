export type Room = {
    id: string
    hotelId: string
    available: number
    total: number
    roomType: 'SINGLE' | 'DOUBLE' | 'TWIN' | 'SUITE' | 'FAMILY' // Add other types if needed
    createdAt: string
    updatedAt: string
    hotel: {
        name: string
    }

}

export type HotelWithRooms = {
    name: string
    rooms: Room[]
}

export type HotelRoomsResponse = {
    hotel: HotelWithRooms
}
