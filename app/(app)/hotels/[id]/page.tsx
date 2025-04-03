

"use client";

import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic'

// // const Map = dynamic(() => import('@/components/map'), {
// //   ssr: false,
// //   loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" />
// // })
export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const router = useRouter()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  if (!id) {
    return notFound();
  }

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotels', id],
    queryFn: async () => {
      const response = await axios.get(`/api/hotels/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !hotel) {
    return notFound();
  }

  return (
    <>
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">

          <Button variant="ghost" className="flex items-center gap-2" onClick={() =>
            router.back()
          }>
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
                alt={hotel.name}
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
                {hotel.location}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hotel.rating}</span>
                <span className="text-muted-foreground">({hotel.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.map((amenity: string) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">${hotel.pricePerNight}</p>
                  <p className="text-muted-foreground">per night</p>
                </div>
                <Button size="lg">Book Now</Button>
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
        </div>
      </div>
    </>
  );
}