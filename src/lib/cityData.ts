export interface TransitNode {
  id: string;
  name: string;
  line: "Purple" | "Green" | "Both" | string;
  code?: string;
  lat?: number;
  lng?: number;
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
      metro: "Namma Metro (BMRCL)"
    },
    passes: [
      { name: "Ordinary Day Pass", price: "₹80", type: "BMTC", color: "text-brand-accent" },
      { name: "Vajra AC Day Pass", price: "₹140", type: "AC", color: "text-indigo-400" },
      { name: "Ordinary Monthly", price: "₹1,200", type: "BMTC", color: "text-brand-accent" },
    ],
    // Official Real BMRCL Operational Metro Network (Purple & Green Lines + Majestic Interchange)
    // Note: Yelahanka does not have an operational metro station (Airport Blue Line Phase 2B under construction).
    metroStations: [
      // --- PURPLE LINE (East -> West: Whitefield to Challaghatta) ---
      { id: "p-wfd", name: "Whitefield (Kadugodi)", line: "Purple", lat: 12.9698, lng: 77.7500 },
      { id: "p-hfc", name: "Hopefarm Channasandra", line: "Purple", lat: 12.9733, lng: 77.7460 },
      { id: "p-ktp", name: "Kadugodi Tree Park", line: "Purple", lat: 12.9782, lng: 77.7397 },
      { id: "p-pta", name: "Pattandur Agrahara", line: "Purple", lat: 12.9818, lng: 77.7327 },
      { id: "p-ssh", name: "Sri Sathya Sai Hospital", line: "Purple", lat: 12.9840, lng: 77.7262 },
      { id: "p-nlh", name: "Nallurhalli", line: "Purple", lat: 12.9845, lng: 77.7208 },
      { id: "p-kdl", name: "Kundalahalli", line: "Purple", lat: 12.9863, lng: 77.7135 },
      { id: "p-stp", name: "Seetharampalya", line: "Purple", lat: 12.9873, lng: 77.7057 },
      { id: "p-hdi", name: "Hoodi", line: "Purple", lat: 12.9882, lng: 77.6974 },
      { id: "p-gdp", name: "Garudacharpalya", line: "Purple", lat: 12.9897, lng: 77.6883 },
      { id: "p-syp", name: "Singayyanapalya", line: "Purple", lat: 12.9930, lng: 77.6787 },
      { id: "p-krp", name: "Krishnarajapura (KR Pura)", line: "Purple", lat: 12.9972, lng: 77.6698 },
      { id: "p-bnh", name: "Benniganahalli", line: "Purple", lat: 12.9933, lng: 77.6599 },
      { id: "p-byh", name: "Baiyappanahalli", line: "Purple", lat: 12.9908, lng: 77.6525 },
      { id: "p-svr", name: "Swami Vivekananda Road", line: "Purple", lat: 12.9861, lng: 77.6433 },
      { id: "p-idg", name: "Indiranagar", line: "Purple", lat: 12.9784, lng: 77.6386 },
      { id: "p-hls", name: "Halasuru", line: "Purple", lat: 12.9760, lng: 77.6267 },
      { id: "p-ty",  name: "Trinity", line: "Purple", lat: 12.9727, lng: 77.6171 },
      { id: "p-mgr", name: "Mahatma Gandhi Road (MG Road)", line: "Purple", lat: 12.9754, lng: 77.6067 },
      { id: "p-cbp", name: "Cubbon Park", line: "Purple", lat: 12.9806, lng: 77.5992 },
      { id: "p-vds", name: "Dr. B.R. Ambedkar Vidhana Soudha", line: "Purple", lat: 12.9798, lng: 77.5925 },
      { id: "p-ctc", name: "Sir M. Visveshwaraya Central College", line: "Purple", lat: 12.9749, lng: 77.5843 },
      { id: "interchange-majestic", name: "Nadaprabhu Kempegowda Station, Majestic", line: "Both", lat: 12.9772, lng: 77.5713 },
      { id: "p-sbc", name: "KSR Bengaluru City Railway Station", line: "Purple", lat: 12.9770, lng: 77.5670 },
      { id: "p-mgrd", name: "Magadi Road", line: "Purple", lat: 12.9757, lng: 77.5552 },
      { id: "p-sbh", name: "Hosahalli (Sri Balagangadharanatha)", line: "Purple", lat: 12.9746, lng: 77.5451 },
      { id: "p-vjn", name: "Vijayanagar", line: "Purple", lat: 12.9697, lng: 77.5376 },
      { id: "p-atg", name: "Attiguppe", line: "Purple", lat: 12.9621, lng: 77.5332 },
      { id: "p-dpn", name: "Deepanjali Nagar", line: "Purple", lat: 12.9525, lng: 77.5287 },
      { id: "p-myr", name: "Mysuru Road", line: "Purple", lat: 12.9463, lng: 77.5255 },
      { id: "p-ptn", name: "Pantharapalya - Nayandahalli", line: "Purple", lat: 12.9405, lng: 77.5209 },
      { id: "p-rrn", name: "Rajarajeshwari Nagar", line: "Purple", lat: 12.9284, lng: 77.5140 },
      { id: "p-jnb", name: "Jnanabharathi", line: "Purple", lat: 12.9197, lng: 77.5050 },
      { id: "p-ptg", name: "Pattanagere", line: "Purple", lat: 12.9141, lng: 77.4984 },
      { id: "p-kbt", name: "Kengeri Bus Terminal", line: "Purple", lat: 12.9090, lng: 77.4913 },
      { id: "p-kng", name: "Kengeri", line: "Purple", lat: 12.9082, lng: 77.4851 },
      { id: "p-clg", name: "Challaghatta", line: "Purple", lat: 12.9011, lng: 77.4727 },

      // --- GREEN LINE (North -> South: Madavara to Silk Institute) ---
      { id: "g-mdv", name: "Madavara (BIEC)", line: "Green", lat: 13.0658, lng: 77.4770 },
      { id: "g-ckb", name: "Chikkabidarakallu (Jindal)", line: "Green", lat: 13.0538, lng: 77.4878 },
      { id: "g-mjn", name: "Manjunath Nagar", line: "Green", lat: 13.0445, lng: 77.4950 },
      { id: "g-ngs", name: "Nagasandra", line: "Green", lat: 13.0368, lng: 77.5020 },
      { id: "g-dsh", name: "Dasarahalli", line: "Green", lat: 13.0298, lng: 77.5125 },
      { id: "g-jlh", name: "Jalahalli", line: "Green", lat: 13.0270, lng: 77.5195 },
      { id: "g-pni", name: "Peenya Industry", line: "Green", lat: 13.0263, lng: 77.5268 },
      { id: "g-pny", name: "Peenya", line: "Green", lat: 13.0287, lng: 77.5348 },
      { id: "g-ggp", name: "Goraguntepalya", line: "Green", lat: 13.0284, lng: 77.5458 },
      { id: "g-ywp", name: "Yeshwanthpur", line: "Green", lat: 13.0232, lng: 77.5502 },
      { id: "g-ssp", name: "Sandal Soap Factory", line: "Green", lat: 13.0147, lng: 77.5539 },
      { id: "g-mlm", name: "Mahalakshmi", line: "Green", lat: 13.0081, lng: 77.5488 },
      { id: "g-rjn", name: "Rajajinagar", line: "Green", lat: 12.9989, lng: 77.5500 },
      { id: "g-kvr", name: "Kuvempu Road", line: "Green", lat: 12.9912, lng: 77.5574 },
      { id: "g-srp", name: "Srirampura", line: "Green", lat: 12.9868, lng: 77.5638 },
      { id: "g-sms", name: "Mantri Square Sampige Road", line: "Green", lat: 12.9850, lng: 77.5710 },
      // Note: Majestic is already indexed above as line: "Both"
      { id: "g-ckp", name: "Chickpete", line: "Green", lat: 12.9664, lng: 77.5752 },
      { id: "g-krm", name: "Krishna Rajendra Market (KR Market)", line: "Green", lat: 12.9602, lng: 77.5750 },
      { id: "g-ncl", name: "National College", line: "Green", lat: 12.9515, lng: 77.5732 },
      { id: "g-lbg", name: "Lalbagh Botanical Garden", line: "Green", lat: 12.9463, lng: 77.5800 },
      { id: "g-sec", name: "South End Circle", line: "Green", lat: 12.9379, lng: 77.5802 },
      { id: "g-jyn", name: "Jayanagar", line: "Green", lat: 12.9298, lng: 77.5828 },
      { id: "g-rvr", name: "Rashtriya Vidyalaya Road (RV Road)", line: "Green", lat: 12.9215, lng: 77.5802 },
      { id: "g-bnk", name: "Banashankari", line: "Green", lat: 12.9155, lng: 77.5735 },
      { id: "g-jpn", name: "Jaya Prakash Nagar (JP Nagar)", line: "Green", lat: 12.9074, lng: 77.5732 },
      { id: "g-ylh", name: "Yelachenahalli", line: "Green", lat: 12.8958, lng: 77.5707 },
      { id: "g-knc", name: "Konanakunte Cross", line: "Green", lat: 12.8856, lng: 77.5684 },
      { id: "g-ddk", name: "Doddakallasandra", line: "Green", lat: 12.8750, lng: 77.5620 },
      { id: "g-vjh", name: "Vajarahalli", line: "Green", lat: 12.8658, lng: 77.5540 },
      { id: "g-tgt", name: "Thalaghattapura", line: "Green", lat: 12.8550, lng: 77.5450 },
      { id: "g-ski", name: "Silk Institute", line: "Green", lat: 12.8420, lng: 77.5350 }
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
      metro: "Delhi Metro (DMRC)"
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
