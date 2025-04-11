// components/search/SearchFilters.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

type Props = {
    searchQuery: string
    setSearchQuery: (val: string) => void
    rating: number
    setRating: (val: number) => void
    selectedCountry: string
    setSelectedCountry: (val: string) => void
    selectedCity: string
    setSelectedCity: (val: string) => void
}

export const SearchFilters = ({
    searchQuery,
    setSearchQuery,
    rating,
    setRating,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity
}: Props) => {
    return (
        <div id="filters" className="space-y-6">
            <div>
                <label className="block mb-1 text-sm font-medium">Search</label>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Country</label>
                <Input value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} />
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
