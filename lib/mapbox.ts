export const MAPBOX_PUBLIC_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface MapboxStyleOption {
  id: string;
  styleId: string;
  label: string;
  icon: string;
  description: string;
  theme: "light" | "dark" | "any";
}

export const MAPBOX_STYLES: Record<string, MapboxStyleOption> = {
  navigation: {
    id: "navigation",
    styleId: "navigation-day-v1",
    label: "Navigation",
    icon: "🧭",
    description: "High-contrast road visibility & turn cues",
    theme: "light",
  },
  streets: {
    id: "streets",
    styleId: "streets-v12",
    label: "Streets",
    icon: "🏙️",
    description: "Crisp city streets, landmarks & transit hubs",
    theme: "light",
  },
  night: {
    id: "night",
    styleId: "navigation-night-v1",
    label: "Night Nav",
    icon: "🌙",
    description: "High-contrast neon routes on dark theme",
    theme: "dark",
  },
  satellite: {
    id: "satellite",
    styleId: "satellite-streets-v12",
    label: "Satellite",
    icon: "🛰️",
    description: "Aerial imagery with vector streets & labels",
    theme: "any",
  },
  outdoors: {
    id: "outdoors",
    styleId: "outdoors-v12",
    label: "Outdoors",
    icon: "🌲",
    description: "Topographic contours & natural landmarks",
    theme: "light",
  },
};

/**
 * Returns the Mapbox 2x retina raster tile URL for Leaflet
 */
export function getMapboxTileUrl(styleKey: string = "navigation"): string {
  const selected = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.navigation;
  return `https://api.mapbox.com/styles/v1/mapbox/${selected.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`;
}

export interface NavigationStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  type: string;
  modifier?: string;
  roadName: string;
  location: [number, number]; // [lat, lng]
}

export interface DetailedRouteResult {
  coordinates: [number, number][]; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  steps: NavigationStep[];
  profile: "driving" | "walking" | "cycling";
  summary: string;
}

/**
 * Formats distance in meters to clean string (e.g. "350 m" or "4.2 km")
 */
export function formatNavDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats duration in seconds to clean string (e.g. "12 min" or "1 hr 15 min")
 */
export function formatNavDuration(seconds: number): string {
  const totalMins = Math.round(seconds / 60);
  if (totalMins < 60) {
    return `${Math.max(1, totalMins)} min`;
  }
  const hours = Math.floor(totalMins / 60);
  const remMins = totalMins % 60;
  return remMins > 0 ? `${hours} hr ${remMins} min` : `${hours} hr`;
}

/**
 * Computes Haversine distance in meters between two [lat, lng] points
 */
function haversineMeters(c1: [number, number], c2: [number, number]): number {
  const R = 6371e3;
  const dLat = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLon = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((c1[0] * Math.PI) / 180) *
      Math.cos((c2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Synthesizes a clean English maneuver instruction from step details
 */
function buildManeuverInstruction(
  type: string,
  modifier?: string,
  roadName?: string
): string {
  const name = roadName && roadName.trim() ? roadName.trim() : "road";
  const mod = modifier ? modifier.replace(/_/g, " ") : "";

  switch (type) {
    case "depart":
      return `Head ${mod || "out"} on ${name}`;
    case "arrive":
      return `Arrive at destination`;
    case "turn":
      return mod ? `Turn ${mod} onto ${name}` : `Turn onto ${name}`;
    case "end of road":
      return mod ? `Turn ${mod} at the end of the road onto ${name}` : `Turn at end of road onto ${name}`;
    case "continue":
    case "new name":
      return `Continue straight onto ${name}`;
    case "roundabout":
    case "rotary":
      return `Enter roundabout and take exit onto ${name}`;
    case "merge":
      return mod ? `Merge ${mod} onto ${name}` : `Merge onto ${name}`;
    case "fork":
      return mod ? `Take the fork ${mod} onto ${name}` : `Take the fork onto ${name}`;
    case "on ramp":
      return `Take ramp onto ${name}`;
    case "off ramp":
      return `Take exit onto ${name}`;
    case "uturn":
      return `Make a U-turn onto ${name}`;
    default:
      return mod ? `Turn ${mod} onto ${name}` : `Proceed onto ${name}`;
  }
}

/**
 * Fetches turn-by-turn road route coordinates [lat, lng][] from Mapbox Directions API (backward compatible)
 */
export async function fetchMapboxRoute(
  origin: [number, number], // [lat, lng]
  destination: [number, number] // [lat, lng]
): Promise<[number, number][] | null> {
  const detailed = await fetchDetailedRoute(origin, destination, "driving");
  return detailed?.coordinates ?? null;
}

/**
 * Fetches full Google Maps-style turn-by-turn route with steps, distance, duration, and road geometry
 */
export async function fetchDetailedRoute(
  origin: [number, number], // [lat, lng]
  destination: [number, number], // [lat, lng]
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<DetailedRouteResult | null> {
  const mapboxProfile =
    profile === "walking" ? "walking" : profile === "cycling" ? "cycling" : "driving";
  const osrmProfile =
    profile === "walking" ? "walking" : profile === "cycling" ? "bike" : "driving";

  // 1. Try Mapbox Directions API first if token is present
  if (MAPBOX_PUBLIC_TOKEN && MAPBOX_PUBLIC_TOKEN.trim() !== "") {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mapboxProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_PUBLIC_TOKEN}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const route = data.routes?.[0];
        if (route && route.geometry?.coordinates?.length) {
          const coordinates: [number, number][] = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          const rawSteps = route.legs?.[0]?.steps || [];
          const steps: NavigationStep[] = rawSteps.map((st: any) => ({
            instruction:
              st.maneuver?.instruction ||
              buildManeuverInstruction(st.maneuver?.type, st.maneuver?.modifier, st.name),
            distanceMeters: Math.round(st.distance || 0),
            durationSeconds: Math.round(st.duration || 0),
            type: st.maneuver?.type || "turn",
            modifier: st.maneuver?.modifier,
            roadName: st.name || "Street",
            location: st.maneuver?.location
              ? [st.maneuver.location[1], st.maneuver.location[0]]
              : coordinates[0],
          }));

          return {
            coordinates,
            distanceMeters: Math.round(route.distance || 0),
            durationSeconds: Math.round(route.duration || 0),
            steps: steps.length > 0 ? steps : createFallbackSteps(origin, destination, route.distance, route.duration),
            profile,
            summary: route.legs?.[0]?.summary || "Optimal route",
          };
        }
      }
    } catch (err) {
      console.warn("Mapbox directions routing failed, attempting OSRM fallback:", err);
    }
  }

  // 2. Fallback to public OSRM router
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(osrmUrl);
    if (res.ok) {
      const data = await res.json();
      const route = data.routes?.[0];
      if (route && route.geometry?.coordinates?.length) {
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );
        const rawSteps = route.legs?.[0]?.steps || [];
        const steps: NavigationStep[] = rawSteps.map((st: any) => ({
          instruction:
            st.maneuver?.instruction ||
            buildManeuverInstruction(st.maneuver?.type, st.maneuver?.modifier, st.name),
          distanceMeters: Math.round(st.distance || 0),
          durationSeconds: Math.round(st.duration || 0),
          type: st.maneuver?.type || "turn",
          modifier: st.maneuver?.modifier,
          roadName: st.name || "Street",
          location: st.maneuver?.location
            ? [st.maneuver.location[1], st.maneuver.location[0]]
            : coordinates[0],
        }));

        return {
          coordinates,
          distanceMeters: Math.round(route.distance || 0),
          durationSeconds: Math.round(route.duration || 0),
          steps: steps.length > 0 ? steps : createFallbackSteps(origin, destination, route.distance, route.duration),
          profile,
          summary: route.legs?.[0]?.summary || "OSRM road route",
        };
      }
    }
  } catch (osrmErr) {
    console.warn("OSRM fallback routing failed:", osrmErr);
  }

  // 3. Resilient synthetic fallback when completely offline / unreachable
  const dist = haversineMeters(origin, destination);
  const speedMps = profile === "walking" ? 1.2 : profile === "cycling" ? 4.5 : 8.5; // ~30 km/h driving
  const dur = Math.round(dist / speedMps);

  const midPoint: [number, number] = [
    (origin[0] + destination[0]) / 2 + 0.002,
    (origin[1] + destination[1]) / 2 - 0.002,
  ];

  return {
    coordinates: [origin, midPoint, destination],
    distanceMeters: Math.round(dist),
    durationSeconds: dur,
    steps: createFallbackSteps(origin, destination, dist, dur),
    profile,
    summary: "Direct arterial route",
  };
}

function createFallbackSteps(
  origin: [number, number],
  destination: [number, number],
  dist: number,
  dur: number
): NavigationStep[] {
  return [
    {
      instruction: "Head toward destination via main arterial road",
      distanceMeters: Math.round(dist * 0.25),
      durationSeconds: Math.round(dur * 0.25),
      type: "depart",
      modifier: "straight",
      roadName: "Main Road",
      location: origin,
    },
    {
      instruction: "Continue straight along primary corridor",
      distanceMeters: Math.round(dist * 0.6),
      durationSeconds: Math.round(dur * 0.6),
      type: "continue",
      modifier: "straight",
      roadName: "City Corridor",
      location: [(origin[0] + destination[0]) / 2, (origin[1] + destination[1]) / 2],
    },
    {
      instruction: "Arrive at destination on the left",
      distanceMeters: Math.round(dist * 0.15),
      durationSeconds: Math.round(dur * 0.15),
      type: "arrive",
      modifier: "left",
      roadName: "Destination",
      location: destination,
    },
  ];
}
