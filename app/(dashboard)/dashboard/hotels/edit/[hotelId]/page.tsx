import { Suspense } from "react"
import { getHotelById } from "@/lib/hotel-service"
import HotelEditClient from "./HotelEditClient"

interface HotelEditPageProps {
  params: {
    hotelId: string
  }
}

export default async function HotelEditPage({ params }: HotelEditPageProps) {
  const hotel = await getHotelById(params.hotelId)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelEditClient hotel={hotel} />
    </Suspense>
  )
}