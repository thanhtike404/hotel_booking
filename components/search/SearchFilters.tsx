"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/data/locations"

type SearchFiltersProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  rating: number
  setRating: (value: number) => void
  selectedCountry: string
  setSelectedCountry: (value: string) => void
  selectedCity: string
  setSelectedCity: (value: string) => void
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  rating,
  setRating,
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
}: SearchFiltersProps) {
  const availableCities = countries.find(c => c.name === selectedCountry)?.cities || []

  return (
    <div id="filters" className="order-2 lg:order-1 space-y-6 lg:sticky lg:top-6 lg:h-fit">
      <div>
        <h3 className="font-semibold mb-4">Search</h3>
        <Input
          placeholder="Search hotels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-4">Location</h3>
        <div className="space-y-4">
          <Select
            value={selectedCountry}
            onValueChange={(value) => {
              setSelectedCountry(value)
              setSelectedCity("")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={!selectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Minimum Rating</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant={rating === star ? "default" : "outline"}
              size="sm"
              onClick={() => setRating(rating === star ? 0 : star)}
            >
              {star}
            </Button>
          ))}
        </div>
      </div>
      <div className="pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setSearchQuery("")
            setRating(0)
            setSelectedCountry("")
            setSelectedCity("")
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}