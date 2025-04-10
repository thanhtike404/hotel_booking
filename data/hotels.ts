export const hotels = {
  featured: [
    {
      id: 1,
      name: "Luxury Resort & Spa",
      location: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      description: "Experience ultimate luxury with private beach access and world-class spa facilities",
      rating: 4.8,

      amenities: ["Spa", "Private Beach", "Pool", "Restaurant", "Gym"],
      rooms: {
        available: 15,
        total: 50
      },
      reviews: 234
    },
    {
      id: 2,
      name: "Metropolitan Grand Hotel",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      description: "Modern luxury in the heart of Manhattan with stunning city views",
      rating: 4.5,

      amenities: ["Business Center", "Restaurant", "Gym", "Bar", "Conference Rooms"],
      rooms: {
        available: 25,
        total: 120
      },
      reviews: 456
    },
    {
      id: 3,
      name: "Oceanfront Paradise Resort",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      description: "Exclusive overwater villas with direct access to crystal clear waters",
      rating: 4.9,

      amenities: ["Private Pool", "Water Sports", "Spa", "Fine Dining", "Butler Service"],
      rooms: {
        available: 8,
        total: 30
      },
      reviews: 189
    }
  ],
  testimonials: [
    {
      id: 1,
      author: "Emily Carter",
      role: "Business Traveler",
      comment: "Amazing experience! The staff was very friendly and the room was perfect. The business facilities were top-notch.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 5,
      date: "2024-02-15",
      hotel: "Metropolitan Grand Hotel"
    },
    {
      id: 2,
      author: "David Smith",
      role: "Family Vacation",
      comment: "Great location and excellent service. The kids loved the pool and beach activities. Will definitely come back!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 4.5,
      date: "2024-02-20",
      hotel: "Luxury Resort & Spa"
    },
    {
      id: 3,
      author: "Sarah Johnson",
      role: "Honeymoon",
      comment: "A perfect honeymoon destination. The overwater villa was breathtaking and the privacy was exceptional.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      rating: 5,
      date: "2024-02-25",
      hotel: "Oceanfront Paradise Resort"
    }
  ],
  popularDestinations: [
    {
      id: 1,
      city: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      hotels: 15,
      rating: 4.7
    },
    {
      id: 2,
      city: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      hotels: 25,
      rating: 4.5
    },
    {
      id: 3,
      city: "Maldives",
      country: "Maldives",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      hotels: 10,
      rating: 4.8
    }
  ]
};