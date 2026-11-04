import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

function findNearestHub(lat: number, lon: number) {
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  // Mode 1: Coordinates provided -> Reverse Geocode
  if (latParam && lonParam) {
    const lat = parseFloat(latParam);
    const lon = parseFloat(lonParam);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const nearestHub = findNearestHub(lat, lon);

    // 1. Try Nominatim (Server-side with custom User-Agent)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "BharatVision/2.0 (civic-transit-platform; contact@bharatvision.in)",
            "Accept-Language": "en",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (nomRes.ok) {
        const data = await nomRes.json();
        const addr = data.address || {};
        const locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.residential ||
          addr.village ||
          addr.city_district ||
          addr.town ||
          (nearestHub.distanceKm < 4 ? nearestHub.locality : "Local Area");
        
        const city = addr.city || addr.state_district || addr.state || "Bengaluru";
        return NextResponse.json({
          success: true,
          locality,
          city,
          full: `${locality}, ${city}`,
          latitude: lat,
          longitude: lon,
          source: "nominatim",
        });
      }
    } catch (e) {
      // Fall through to secondary provider
    }

    // 2. Try BigDataCloud Client API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (bdcRes.ok) {
        const data = await bdcRes.json();
        const locality =
          data.locality ||
          data.principalSubdivision ||
          (nearestHub.distanceKm < 4 ? nearestHub.locality : "Bengaluru Area");
        const city = data.city || "Bengaluru";
        return NextResponse.json({
          success: true,
          locality,
          city,
          full: `${locality}, ${city}`,
          latitude: lat,
          longitude: lon,
          source: "bigdatacloud",
        });
      }
    } catch (e) {
      // Fall through to hub fallback
    }

    // 3. Fallback to closest local hub
    return NextResponse.json({
      success: true,
      locality: nearestHub.locality,
      city: nearestHub.city,
      full: `${nearestHub.locality}, ${nearestHub.city}`,
      latitude: lat,
      longitude: lon,
      source: "local-hub-cache",
    });
  }

  // Mode 2: No coordinates provided -> Detect client location via IP
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const ipRes = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (ipRes.ok) {
      const data = await ipRes.json();
      if (data.latitude && data.longitude) {
        const locality = data.locality || data.city || "Bengaluru Central";
        const city = data.city || "Bengaluru";
        return NextResponse.json({
          success: true,
          latitude: data.latitude,
          longitude: data.longitude,
          locality,
          city,
          full: `${locality}, ${city}`,
          source: "ip-detection",
        });
      }
    }
  } catch (e) {
    // Fall through to default
  }

  // Fallback default: Bengaluru MG Road
  return NextResponse.json({
    success: true,
    latitude: 12.9716,
    longitude: 77.5946,
    locality: "Central Bengaluru",
    city: "Bengaluru",
    full: "Central Bengaluru, Bengaluru",
    source: "default-bengaluru",
  });
}
