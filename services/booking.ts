import axios from "axios";

export const batchDeleteBookings = async (bookingIds: string[]) => {
  try {
    console.log("Attempting to delete booking IDs:", bookingIds);
    
    const response = await axios.delete('/api/dashboard/bookings', {
      data: { ids: bookingIds },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Batch delete response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error batch deleting bookings:", error);
    
    // Provide more detailed error information
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Response status:", error.response.status);
      throw new Error(`Server error: ${error.response.data?.error || 'Unknown error'}`);
    } else if (error.request) {
      console.error("Request error:", error.request);
      throw new Error("Network error: No response received from server");
    } else {
      console.error("General error:", error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};