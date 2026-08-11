// Defines the exact structure of a user's Karma profile
export interface CommuterProfile {
  id: string;
  karmaPoints: number;
  level: "BRONZE" | "SILVER" | "GOLD" | "NAMMA YODHA";
}

// Defines a live hazard report
export interface HazardReport {
  id: string;
  type: string;
  location: string;
  verified: number;
  time: string;
}

// Mathematically calculates the user's tier based on points
export function calculateLevel(points: number): CommuterProfile["level"] {
  if (points >= 1000) return "NAMMA YODHA"; // Top tier community defender
  if (points >= 500) return "GOLD";
  if (points >= 200) return "SILVER";
  return "BRONZE";
}

// Grants points when a user helps the community
export function processHazardReport(currentPoints: number): number {
  // A verified hazard report instantly grants 50 Karma points
  return currentPoints + 50;
}