"use client"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { HotelFilterProps } from "@/types/search";

export const HotelFilter = ({
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    priceRange,
    setPriceRange,
    selectedAmenities,
    setSelectedAmenities,
    rating,
    setRating,
    cities
}: HotelFilterProps) => {
    return (
        <div id="filters" className="space-y-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Search</label>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">City</label>
                <Input value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Minimum Rating: {rating}</label>
                <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={[rating]}
                    onValueChange={(val) => setRating(val[0])}
                />
            </div>
        </div>
    )
}
