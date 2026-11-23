export const MAPBOX_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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
export function getMapboxTileUrl(styleKey: string = "streets"): string {
  const selected = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.streets;
  return `https://api.mapbox.com/styles/v1/mapbox/${selected.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`;
}

/**
 * Fetches turn-by-turn road route coordinates [lat, lng][] from Mapbox Directions API
 */
export async function fetchMapboxRoute(
  origin: [number, number], // [lat, lng]
  destination: [number, number] // [lat, lng]
): Promise<[number, number][] | null> {
  // 1. Try Mapbox Directions API if access token is available
  if (MAPBOX_PUBLIC_TOKEN && MAPBOX_PUBLIC_TOKEN.trim() !== "") {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?geometries=geojson&overview=full&access_token=${MAPBOX_PUBLIC_TOKEN}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]?.geometry?.coordinates) {
          // Mapbox returns [lng, lat], Leaflet requires [lat, lng]
          return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        }
      }
    } catch (err) {
      console.warn("Mapbox directions routing failed, attempting OSRM fallback:", err);
    }
  }

  // 2. Fallback to free public OSRM router so routes ALWAYS follow actual road geometry and never draw straight lines
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0]?.geometry?.coordinates) {
        return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
      }
    }
  } catch (osrmErr) {
    console.warn("OSRM fallback routing failed:", osrmErr);
  }

  return null;
}
