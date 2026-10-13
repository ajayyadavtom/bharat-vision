/**
 * Real-time Geolocation & Reverse Geocoding Helper
 * 100% Public, Free, Zero API Keys Required
 */

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  localityName: string;
  cityName: string;
  fullDisplayName: string;
}

/**
 * Reverse geocodes latitude and longitude into human-readable Indian neighborhoods
 * Uses Nominatim with fallback to BigDataCloud
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number
): Promise<{ locality: string; city: string; full: string }> {
  try {
    // 1. Try OpenStreetMap Nominatim for detailed neighborhood / suburb
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: { 'User-Agent': 'BharatVision/2.0 (transit-app)' },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.village ||
        addr.city_district ||
        addr.town ||
        "Local Area";
      const city = addr.city || addr.state_district || addr.state || "Bengaluru";
      return {
        locality,
        city,
        full: `${locality}, ${city}`,
      };
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode fallback:", err);
  }

  try {
    // 2. Fallback to BigDataCloud Client API (fast and zero key)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.principalSubdivision || "Current Location";
      const city = data.city || "Bengaluru";
      return {
        locality,
        city,
        full: `${locality}, ${city}`,
      };
    }
  } catch (err) {
    console.warn("BigDataCloud fallback failed:", err);
  }

  return {
    locality: "Live Location",
    city: "Local Area",
    full: "Live GPS Location",
  };
}

/**
 * Requests the browser / mobile GPS location
 */
export function requestBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return reject(new Error("Geolocation is not supported by your browser or device."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  });
}
