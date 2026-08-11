// Define what a "segment" of a trip looks like in Bharat Vision
export interface TransitSegment {
  id: string;
  mode: "WALK" | "AUTO_ONDC" | "BUS_BMTC" | "METRO";
  transitTime: number;  // T_transit in minutes
  waitTime: number;     // T_wait in minutes
  fare: number;         // F in Rupees
  walkDistance: number; // D_walk in meters
}

// The core A* Cost Calculator based on the user's preference
export function calculateAStarCost(
  segment: TransitSegment, 
  userPreference: "CHEAPEST" | "FASTEST" | "BALANCED"
): number {
  
  // Default AI Weights (w1, w2, w3, w4)
  let w1 = 1.0; // Transit Time weight
  let w2 = 2.5; // Wait Time weight (Heavily penalized because waiting is annoying!)
  let w3 = 1.0; // Fare weight
  let w4 = 1.5; // Walking Distance weight (Per 100 meters)

  // Dynamic AI adjustment based on what the user wants
  if (userPreference === "CHEAPEST") {
    w3 = 3.5; // Money is heavily penalized if it's high
    w1 = 0.5; // User is willing to sit in the bus longer
    w2 = 1.5; // User is willing to wait a bit longer for a cheaper bus
  } else if (userPreference === "FASTEST") {
    w1 = 3.0; // Travel time is heavily penalized (we want the shortest time)
    w2 = 3.0; // Waiting is unacceptable
    w3 = 0.2; // The user doesn't care if the ONDC auto costs ₹80 to bridge the gap
  }

  // The mathematical cost function
  const cost = 
    (w1 * segment.transitTime) + 
    (w2 * segment.waitTime) + 
    (w3 * segment.fare) + 
    (w4 * (segment.walkDistance / 100));

  return parseFloat(cost.toFixed(2));
}

// A simulation function that generates 3 multi-modal route options
export function generateSmartRoutes(start: string, destination: string) {
  const routes = [
    {
      id: "route_1",
      name: "The Namma Yatri + Bus Combo",
      segments: [
        { mode: "AUTO_ONDC", transitTime: 5, waitTime: 2, fare: 45, walkDistance: 0 },
        { mode: "BUS_BMTC", transitTime: 40, waitTime: 5, fare: 20, walkDistance: 200 }
      ],
      totalFare: 65,
      totalTime: 52
    },
    {
      id: "route_2",
      name: "Direct BMTC Vajra (AC)",
      segments: [
        { mode: "WALK", transitTime: 8, waitTime: 0, fare: 0, walkDistance: 600 },
        { mode: "BUS_BMTC", transitTime: 45, waitTime: 12, fare: 40, walkDistance: 100 }
      ],
      totalFare: 40,
      totalTime: 65
    }
  ];

  return routes;
}