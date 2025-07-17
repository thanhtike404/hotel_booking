import axios from "axios";

export const getNotifications = async (userId: string) => {
  try {
    const response = await axios.get('/api/dashboard/notifications/', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        userId: userId, 
      },
    });
    console.log("Fetched notifications:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};