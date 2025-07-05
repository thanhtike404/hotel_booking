import axios from "axios";

export const getNotifications = async () => {
  try {
    const response = await axios.get('/api/dashboard/notifications');
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};