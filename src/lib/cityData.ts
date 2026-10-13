export interface TransitNode {
  id: string;
  name: string;
  line: string;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  primaryLanguage: string;
  transitAuthorities: {
    bus: string;
    metro: string;
  };
  passes: { name: string; price: string; type: string; color: string; }[];
  metroStations: TransitNode[];
}

export const CITIES: Record<string, CityData> = {
  "bengaluru": {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    coordinates: [13.0150, 77.5900],
    primaryLanguage: "Kannada",
    transitAuthorities: {
      bus: "BMTC",
      metro: "Namma Metro"
    },
    passes: [
      { name: "Ordinary Day Pass", price: "₹80", type: "BMTC", color: "text-brand-accent" },
      { name: "Vajra AC Day Pass", price: "₹140", type: "AC", color: "text-indigo-400" },
      { name: "Ordinary Monthly", price: "₹1,200", type: "BMTC", color: "text-brand-accent" },
    ],
    metroStations: [
      { id: "s1", name: "Yelahanka Hub", line: "Green" },
      { id: "s2", name: "Nagasandra", line: "Green" },
      { id: "s3", name: "Yeshwanthpur", line: "Green" },
      { id: "s4", name: "Majestic (Interchange)", line: "Both" },
      { id: "s5", name: "MG Road", line: "Purple" },
      { id: "s6", name: "Indiranagar", line: "Purple" },
      { id: "s7", name: "Whitefield", line: "Purple" },
      { id: "s8", name: "Kengeri", line: "Purple" },
    ]
  },
  "delhi": {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    coordinates: [28.6139, 77.2090],
    primaryLanguage: "Hindi",
    transitAuthorities: {
      bus: "DTC",
      metro: "Delhi Metro"
    },
    passes: [
      { name: "Daily Bus Pass (Non-AC)", price: "₹40", type: "DTC", color: "text-brand-accent" },
      { name: "Daily Bus Pass (AC)", price: "₹50", type: "AC", color: "text-indigo-400" },
      { name: "Monthly All-Route", price: "₹1,000", type: "DTC", color: "text-brand-accent" },
    ],
    metroStations: [
      { id: "d1", name: "Rajiv Chowk (Interchange)", line: "Both" },
      { id: "d2", name: "Hauz Khas", line: "Yellow" },
      { id: "d3", name: "Kashmere Gate", line: "Yellow" },
      { id: "d4", name: "Noida Sector 15", line: "Blue" },
      { id: "d5", name: "Dwarka Sector 21", line: "Blue" },
    ]
  }
};

export const getCityData = (cityId: string): CityData => {
  return CITIES[cityId] || CITIES["bengaluru"];
};
