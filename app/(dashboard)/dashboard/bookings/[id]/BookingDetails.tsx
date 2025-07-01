'use client';
import { useBooking } from "@/hooks/dashboard/useBooking";
import { calculateTotalPrice } from "@/lib/totalPrice";
import { ArrowLeft, Hotel, CalendarDays, User, Wifi, Snowflake, Bath, Tv, Wine } from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard/loading";
import { ErrorDisplay } from "@/components/dashboard/errorDisplay";


export default function BookingDetail(id: string) {
 
  const { data: bookingData, isLoading, error } = useBooking(id);
  function formatDate(dateString: string | null) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatDateShort(dateString: string | null) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  const amenityIcons: Record<string, React.FC<any>> = {
    "Free WiFi": Wifi,
    "Air Conditioning": Snowflake,
    "Private Bathroom": Bath,
    "TV": Tv,
    "Mini Bar": Wine
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;


  const totalPrice = calculateTotalPrice(bookingData);
  const nights = Math.ceil(
    (new Date(bookingData?.booking?.checkOut).getTime() - new Date(bookingData?.booking?.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4">
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Bookings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {bookingData?.room?.name}
              </h1>
              <p className="text-lg text-gray-600">
                {bookingData?.room?.roomType} • ${bookingData?.room?.price} per night
              </p>
            </div>
            
            <div className="relative">
              <img
                src={bookingData?.room?.image}
                alt={bookingData?.room?.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                bookingData?.booking?.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {bookingData?.booking?.status.charAt(0).toUpperCase() + bookingData?.booking?.status.slice(1)}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Room Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bookingData?.room?.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || Hotel;
                  return (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Availability Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Availability
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {bookingData?.room?.available}
                  </span> of {bookingData?.room?.total} rooms available
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{
                      width: `${(bookingData?.room?.available / bookingData?.room?.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Booking Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Check-in</p>
                    <p className="text-sm text-gray-600">
                      {formatDateShort(bookingData?.booking?.checkIn)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Check-out</p>
                    <p className="text-sm text-gray-600">
                      {formatDateShort(bookingData?.booking?.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hotel className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Room Type</p>
                    <p className="text-sm text-gray-600">
                      {bookingData?.room?.roomType}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Booking ID</p>
                    <p className="text-sm text-gray-600 font-mono">
                      {bookingData?.booking?.id.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    ${bookingData?.room?.price} × {nights} nights
                  </span>
                  <span className="text-gray-900">
                    ${bookingData?.room?.price * nights}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">${totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detailed Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Check-in Date:</span>
                  <p className="text-gray-600 mt-1">
                    {formatDate(bookingData?.booking?.checkIn)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Check-out Date:</span>
                  <p className="text-gray-600 mt-1">
                    {formatDate(bookingData?.booking?.checkOut)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Nights:</span>
                  <p className="text-gray-600 mt-1">{nights} nights</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Booked on:</span>
                  <p className="text-gray-600 mt-1">
                    {formatDate(bookingData?.booking?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}