export const countries = [
  {
    name: "United States",
    cities: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Miami",
      "Las Vegas",
      "San Francisco",
      "Boston",
      "Seattle"
    ]
  },
  {
    name: "United Kingdom",
    cities: [
      "London",
      "Manchester",
      "Birmingham",
      "Edinburgh",
      "Glasgow",
      "Liverpool"
    ]
  },
  {
    name: "France",
    cities: [
      "Paris",
      "Nice",
      "Lyon",
      "Marseille",
      "Bordeaux",
      "Toulouse"
    ]
  },
  {
    name: "Japan",
    cities: [
      "Tokyo",
      "Osaka",
      "Kyoto",
      "Sapporo",
      "Fukuoka",
      "Nagoya"
    ]
  },
  {
    name: "Australia",
    cities: [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Gold Coast"
    ]
  }
];

export type Country = {
  name: string;
  cities: string[];
};