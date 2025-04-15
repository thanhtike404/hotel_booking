"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import * as z from "zod"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Hotel, Room, Review, Booking } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type HotelWithRelations = Hotel & {
  rooms: Room[]
  reviews: Review[]
  bookings: Booking[]
}

const hotelFormSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  countryId: z.string().min(1, "Country is required"),
  cityId: z.string().min(1, "City is required"),
  image: z.string().url("Please provide a valid image URL"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  featured: z.boolean().default(false),
})

type HotelFormValues = z.infer<typeof hotelFormSchema>

export default function HotelEditClient({ hotel }: { hotel: HotelWithRelations | null }) {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [amenity, setAmenity] = useState("")
  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>(undefined)
  const [InitialCityId, setInitialCityId] = useState(hotel?.cityId)


  const fetchCountries = async () => {
    const response = await axios.get(`/api/locations/${hotel?.cityId}`)
    return response.data.id
  }

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axios.get("/api/locations")
      return response.data
    },
  })

  const { data: InitialCountryId } = useQuery({
    queryKey: ["countries", hotel?.cityId],
    queryFn: fetchCountries,
  })

  console.log(InitialCountryId,)

  if (!hotel) {
    return <div>Hotel not found</div>
  }

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: hotel.name,
      description: hotel.description,
      image: hotel.image,
      rating: hotel.rating,
      cityId: InitialCityId,
      countryId: InitialCountryId,
      amenities: hotel.amenities as string[],
      featured: hotel.featured,
    },
  })
  useEffect(() => {
    if (InitialCountryId) {
      setSelectedCountryId(InitialCountryId)
      form.setValue("countryId", InitialCountryId)
    }
  }, [InitialCountryId, form])

  const availableCities =
    locations?.find((c: {
      id: string,
      cities: { id: string, name: string }[]
    }) => c.id === selectedCountryId)?.cities || []

  const updateHotelMutation = useMutation({
    mutationFn: async (data: HotelFormValues) => {
      const response = await axios.patch(`/api/dashboard/hotels/${hotel?.id}`, data)
      return response.data
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Hotel updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["hotels"] })
      queryClient.invalidateQueries({ queryKey: ["hotel", hotel.id] })
      try {
        router.push(`/dashboard/hotels/${hotel.id}`)

      } catch (error) {
        console.error("Error navigating to hotel details:", error)

      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update hotel. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating hotel:", error)
    },
  })

  const onSubmit = (data: HotelFormValues) => {

    try {

      updateHotelMutation.mutate(data)



    } catch (error) {

      console.error("Error updating hotel:", error)

    }
  }

  const addAmenity = () => {
    if (amenity.trim() === "") return

    const currentAmenities = form.getValues("amenities") || []
    form.setValue("amenities", [...currentAmenities, amenity.trim()])
    setAmenity("")
  }

  const removeAmenity = (index: number) => {
    const currentAmenities = form.getValues("amenities") || []
    form.setValue(
      "amenities",
      currentAmenities.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/dashboard/hotels/${hotel.id}`} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to fucking  Hotel Details
        </Link>
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Hotel</h1>
          <p className="text-muted-foreground mt-2">Update hotel information</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hotel name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCountryId(value)
                          form.setValue("cityId", "")
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations?.map((country: {
                            id: string,
                            name: string
                          }) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => {
                    const selectedCity = availableCities.find(city => city.id === field.value);

                    return (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a city">
                                {selectedCity ? selectedCity.name : "Select a city"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableCities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

              </div>


              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter rating"
                        min={0}
                        max={5}
                        step={0.1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hotel description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormLabel>Amenities</FormLabel>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add amenity"
                    value={amenity}
                    onChange={(e) => setAmenity(e.target.value)}
                  />
                  <Button type="button" onClick={addAmenity}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("amenities")?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="text-xs hover:text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.amenities && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.amenities.message}
                  </p>
                )}
              </div>


              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Hotel</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        This hotel will be displayed in featured sections
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/hotels/${hotel.id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateHotelMutation.isPending}
              >
                {updateHotelMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}