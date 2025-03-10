export default function BookingsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="space-y-4">
          {/* Placeholder for bookings list */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No bookings found.</p>
          </div>
        </div>
      </div>
    </div>
  )
}