'use client'

import { useState } from 'react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Search params:', searchParams)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Hotels</h1>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Where are you going?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Check-in</label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Check-out</label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Guests</label>
            <input
              type="number"
              min="1"
              value={searchParams.guests}
              onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}