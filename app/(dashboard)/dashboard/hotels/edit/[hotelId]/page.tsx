import { Suspense } from "react"
import { getHotelById } from "@/lib/hotel-service"
import HotelEditClient from "./HotelEditClient"

import { HotelEditPageProps } from "@/types/hotel";

export default async function HotelEditPage({ params }: HotelEditPageProps) {
  const { hotelId } =await params
  const hotel = await getHotelById(hotelId)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelEditClient hotel={hotel} />
    </Suspense>
  )
}