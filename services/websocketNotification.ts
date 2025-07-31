import axios from 'axios';

interface WebSocketNotificationPayload {
  action: string;
  userId: string;
  message: string;
  type?: string;
  data?: any;
}

export const sendWebSocketNotification = async (payload: WebSocketNotificationPayload) => {
  try {
    // You can either send directly to your AWS API Gateway WebSocket endpoint
    // or create a server-side endpoint that handles WebSocket messaging
    
    // Option 1: Direct AWS API Gateway WebSocket call (if you have a REST API to trigger WebSocket)
    const wsApiUrl = process.env.WEBSOCKET_API_URL;
    if (wsApiUrl) {
      const response = await axios.post(wsApiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    }
    
    // Option 2: If you don't have a REST API, we'll need to use AWS SDK
    // For now, we'll log the payload that should be sent
    console.log('WebSocket notification payload:', payload);
    return { success: true, payload };
    
  } catch (error) {
    console.error('Failed to send WebSocket notification:', error);
    throw error;
  }
};

export const sendBookingNotificationToAdmins = async (
  adminUserIds: string[],
  bookingDetails: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
  },
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' = 'REQUESTED'
) => {
  const statusMessages = {
    REQUESTED: `New booking request from ${bookingDetails.guestName} (${bookingDetails.guestEmail}) for ${bookingDetails.roomName} at ${bookingDetails.hotelName} from ${new Date(bookingDetails.checkIn).toLocaleDateString()} to ${new Date(bookingDetails.checkOut).toLocaleDateString()}. Booking ID: ${bookingDetails.bookingId}`,
    ACCEPTED: `Booking ${bookingDetails.bookingId} has been accepted for ${bookingDetails.guestName} at ${bookingDetails.hotelName}`,
    REJECTED: `Booking ${bookingDetails.bookingId} has been rejected for ${bookingDetails.guestName} at ${bookingDetails.hotelName}`
  };

  const message = statusMessages[status];

  const notifications = await Promise.all(
    adminUserIds.map(userId =>
      sendWebSocketNotification({
        action: 'sendNotification',
        userId,
        message,
        type: 'booking',
        data: { 
          ...bookingDetails,
          status
        }
      })
    )
  );

  return notifications;
};
export const updateBookingNotificationStatus = async (
  bookingId: string,
  status: 'ACCEPTED' | 'REJECTED',
  adminUserIds: string[],
  bookingDetails: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
  }
) => {
  // Send notification to admins about the status change
  const notifications = await sendBookingNotificationToAdmins(
    adminUserIds,
    bookingDetails,
    status
  );

  return notifications;
};

export const sendBookingStatusUpdateToGuest = async (
  guestUserId: string,
  bookingDetails: {
    bookingId: string;
    guestName: string;
    hotelName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
  },
  status: 'ACCEPTED' | 'REJECTED'
) => {
  const statusMessages = {
    ACCEPTED: `Great news! Your booking at ${bookingDetails.hotelName} has been confirmed. Booking ID: ${bookingDetails.bookingId}`,
    REJECTED: `We're sorry, but your booking request at ${bookingDetails.hotelName} has been declined. Booking ID: ${bookingDetails.bookingId}`
  };

  const message = statusMessages[status];

  const notification = await sendWebSocketNotification({
    action: 'sendNotification',
    userId: guestUserId,
    message,
    type: 'booking_status',
    data: { 
      ...bookingDetails,
      status
    }
  });

  return notification;
}