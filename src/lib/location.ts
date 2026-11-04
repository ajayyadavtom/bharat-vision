/**
 * Real-time Geolocation & Reverse Geocoding Helper
 * 100% Resilient Multi-tiered Positioning:
 * 1. High-accuracy GPS (Mobile / outdoor devices)
 * 2. Standard-accuracy Geolocation (Laptops / indoor Wi-Fi networks)
 * 3. Server-side / IP Geolocation fallback (Always succeeds even when GPS is denied or unsupported)
 * 4. Local Bengaluru landmark resolver (Zero latency offline fallback)
 */

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  localityName: string;
  cityName: string;
  fullDisplayName: string;
}

export interface BrowserLocationResult {
  latitude: number;
  longitude: number;
  isRealGps: boolean;
  locality?: string;
  city?: string;
}

// Known Bengaluru Landmark Hubs for zero-latency local fallback
const BENGALURU_HUBS = [
  { name: "Kempegowda Bus Station (Majestic)", locality: "Majestic", city: "Bengaluru", lat: 12.9772, lon: 77.5713 },
  { name: "Central Silk Board", locality: "Silk Board", city: "Bengaluru", lat: 12.9172, lon: 77.6228 },
  { name: "Indiranagar 100ft Road", locality: "Indiranagar", city: "Bengaluru", lat: 12.9784, lon: 77.6408 },
  { name: "Koramangala 5th Block", locality: "Koramangala", city: "Bengaluru", lat: 12.9345, lon: 77.6180 },
  { name: "Whitefield TTMC", locality: "Whitefield", city: "Bengaluru", lat: 12.9863, lon: 77.7335 },
  { name: "Hebbal Flyover", locality: "Hebbal", city: "Bengaluru", lat: 13.0358, lon: 77.5970 },
  { name: "Electronic City Phase 1", locality: "Electronic City", city: "Bengaluru", lat: 12.8452, lon: 77.6602 },
  { name: "Jayanagar 4th Block", locality: "Jayanagar", city: "Bengaluru", lat: 12.9299, lon: 77.5833 },
  { name: "HSR Layout BDA Complex", locality: "HSR Layout", city: "Bengaluru", lat: 12.9116, lon: 77.6389 },
  { name: "MG Road Metro", locality: "MG Road", city: "Bengaluru", lat: 12.9756, lon: 77.6066 },
  { name: "Yeshwanthpur TTMC", locality: "Yeshwanthpur", city: "Bengaluru", lat: 13.0222, lon: 77.5516 },
  { name: "Marathahalli Bridge", locality: "Marathahalli", city: "Bengaluru", lat: 12.9562, lon: 77.7011 },
  { name: "Banashankari TTMC", locality: "Banashankari", city: "Bengaluru", lat: 12.9177, lon: 77.5739 },
  { name: "BTM Layout 2nd Stage", locality: "BTM Layout", city: "Bengaluru", lat: 12.9166, lon: 77.6101 },
  { name: "Yelahanka NES", locality: "Yelahanka", city: "Bengaluru", lat: 13.1007, lon: 77.5963 }
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestLocalHub(lat: number, lon: number) {
  let nearest = BENGALURU_HUBS[0];
  let minDist = Infinity;
  for (const hub of BENGALURU_HUBS) {
    const d = getDistanceKm(lat, lon, hub.lat, hub.lon);
    if (d < minDist) {
      minDist = d;
      nearest = hub;
    }
  }
  return { ...nearest, distanceKm: minDist };
}

/**
 * Reverse geocodes latitude and longitude into human-readable neighborhoods
 * 1. Internal /api/location (Next.js server-side, with full user agent, zero CORS blocks)
 * 2. BigDataCloud Client API fallback
 * 3. Local landmark hub matching
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number
): Promise<{ locality: string; city: string; full: string }> {
  // Check if coordinates are close to a prominent Bengaluru hub
  const nearestHub = findNearestLocalHub(lat, lon);

  // 1. Try our Next.js API route first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`/api/location?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.locality) {
        return {
          locality: data.locality,
          city: data.city || "Bengaluru",
          full: data.full || `${data.locality}, ${data.city || "Bengaluru"}`,
        };
      }
    }
  } catch (err) {
    // API route timed out or not available, fallback to client fetch
  }

  // 2. Direct client fallback to BigDataCloud
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality =
        data.locality ||
        data.principalSubdivision ||
        (nearestHub.distanceKm < 5 ? nearestHub.locality : "Current Location");
      const city = data.city || "Bengaluru";
      return {
        locality,
        city,
        full: `${locality}, ${city}`,
      };
    }
  } catch (err) {
    // Continue to local hub fallback
  }

  // 3. Guaranteed local hub fallback
  return {
    locality: nearestHub.locality,
    city: nearestHub.city,
    full: `${nearestHub.locality}, ${nearestHub.city}`,
  };
}

/**
 * Fallback to IP-based location detection when device GPS is denied, timed out, or unavailable
 */
async function getIpLocationFallback(): Promise<BrowserLocationResult> {
  // 1. Try Next.js API route
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch("/api/location", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          locality: data.locality || "Central Bengaluru",
          city: data.city || "Bengaluru",
          isRealGps: false,
        };
      }
    }
  } catch (e) {
    // Fall through
  }

  // 2. Direct client fallback to BigDataCloud
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          locality: data.locality || data.city || "Bengaluru Area",
          city: data.city || "Bengaluru",
          isRealGps: false,
        };
      }
    }
  } catch (e) {
    // Fall through
  }

  // 3. Absolute default: Central Bengaluru (MG Road)
  return {
    latitude: 12.9716,
    longitude: 77.5946,
    locality: "Central Bengaluru",
    city: "Bengaluru",
    isRealGps: false,
  };
}

/**
 * Requests the browser / mobile GPS location with 3-stage progressive fallback:
 * Stage 1: High accuracy GPS (Fast 5s timeout, works outdoors on mobile)
 * Stage 2: Standard accuracy Geolocation (Fast 5s timeout, works on laptops, Wi-Fi, indoors)
 * Stage 3: IP Location Fallback (Works everywhere, 100% resilient, never rejects)
 */
export function requestBrowserLocation(): Promise<BrowserLocationResult> {
  return new Promise((resolve) => {
    // Check if navigator.geolocation is supported
    if (typeof window === "undefined" || !navigator || !navigator.geolocation) {
      getIpLocationFallback().then(resolve);
      return;
    }

    // Stage 1: High Accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isRealGps: true,
        });
      },
      (errorStage1) => {
        // If user explicitly denied, don't badger them with a second prompt; jump straight to IP
        if (errorStage1 && errorStage1.code === 1) { // PERMISSION_DENIED
          getIpLocationFallback().then(resolve);
          return;
        }

        // Stage 2: Standard Accuracy (Wi-Fi / Network positioning, essential for laptops & indoors)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              isRealGps: true,
            });
          },
          () => {
            // Stage 3: IP Geolocation Fallback
            getIpLocationFallback().then(resolve);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 120000,
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000,
      }
    );
  });
}
