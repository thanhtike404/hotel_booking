"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft, BedDouble, Users, Check } from "lucide-react";
import BookingModal from "./bookingModel";
// import { BookingModal } from "@/components/hotrel/BookingModal";
import { notFound, useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { RoomCard } from "@/components/hotel/RoomCard";
import { Hotel } from "@/types/hotel";
export type Room = {
  id: string;
  hotelId: string;
  available: number;
  total: number;
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "FAMILY";
  createdAt: string;
  updatedAt: string;
  image: string;
  price: number;
  amenities: string[];
  name: string;
  description?: string;
  maxOccupancy?: number;
  features?: string[];
};
// // const Map = dynamic(() => import('@/components/map'), {
// //   ssr: false,
// //   loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" />
// // })
export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params promise
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { data, status } = useSession();
  if (!id) {
    return notFound();
  }

  const {
    data: hotel,
    isLoading,
    error,
  } = useQuery<Hotel>({
    queryKey: ["hotels", id],
    queryFn: async () => {
      const response = await axios.get(`/api/hotels/${id}`);
      return response.data;
    },
  });

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return notFound();
  }

  return (
    <>
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Hotels</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px]">
            {hotel.image && (
              <Image
                alt={hotel.id}
                src={hotel.image}
                fill
                className="object-cover rounded-lg"
                priority
              />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {hotel?.city?.name + ", " + hotel?.city?.country?.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotel.rating}</span>
                <span className="text-muted-foreground">
                  ({hotel.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {(hotel.amenities || [])?.map((amenity: string) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            {/* <Map
              center={hotelCoords}
              name={hotel.name}
              location={hotel.location}
            /> */}
          </div>

          <div className="col-span-full">
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                hotel?.rooms?.map((room: Room) => (
                  <div
                    key={room.id}
                    className="flex flex-col md:flex-row border rounded-lg p-4 gap-4 shadow-sm"
                  >
                    <div className="w-full md:w-1/4 relative h-40 md:h-auto">
                      {room.image ? (
                        <Image
                          src={room.image}
                          alt={room.id}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                          <BedDouble className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{room.name}</h3>
                        <div className="text-lg font-bold text-primary">
                          ${room.price}
                          <span className="text-sm text-muted-foreground font-normal">
                            {" "}
                            / night
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground">
                        {room.description || "Room details"}
                      </p>

                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            Sleeps {room.maxOccupancy || room.available || 2}
                          </span>
                        </div>

                        {room.features &&
                          room.features
                            .slice(0, 3)
                            .map((feature: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-1"
                              >
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                      </div>
                    </div>
                    {status === "authenticated" && (
                      <div className="flex items-end justify-end md:w-1/6 mt-4 md:mt-0">
                        <Button
                          className="w-full md:w-auto"
                          onClick={() => handleBookRoom(room)}
                        >
                          Book Now
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}

              {(!hotel.rooms || hotel.rooms.length === 0) && (
                <p className="text-muted-foreground text-center">
                  No rooms available at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedRoom && (
        <BookingModal
          email={data?.user?.email || ""}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          room={selectedRoom}
          hotelId={id}
          hotelName={hotel.name}
        />
      )}
    </>
  );
}
