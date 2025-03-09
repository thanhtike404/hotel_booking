import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome to Hotel Booking</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Stay</h2>
              <Link 
                href="/search" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Search Hotels
              </Link>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
              <p className="text-muted-foreground">Discover our latest deals and promotions</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
              <Link 
                href="/bookings" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}