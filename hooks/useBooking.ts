import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const queryKey=['bookings']

const getRooms=async():Promise<any>=>{
    const response=await axios.get(`/api/bookings`);
    console.log(response.data)
    return response.data
}

export const useBookings= ()=>{
    return  useQuery({
        queryKey:[queryKey],
        queryFn:getRooms
    })
}
