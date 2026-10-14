import { NextRequest, NextResponse } from "next/server";

export type CrowdLevel = "Low" | "Moderate" | "High";

export interface CrowdReport {
  id: string;
  busId: string;
  crowdLevel: CrowdLevel;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  speed?: number; // in km/h
  userId?: string;
}

export interface ActiveBusStatus {
  busId: string;
  crowdLevel: CrowdLevel;
  score: number; // 1.0 (Low) to 3.0 (High)
  color: string; // Green (#10b981), Yellow (#f59e0b), Red (#ef4444)
  occupancyPercent: number;
  reportCount: number;
  lastUpdated: number;
  expiresInSec: number;
  recentReports: {
    crowdLevel: CrowdLevel;
    timestamp: number;
    speed?: number;
  }[];
}

// 30 minutes in milliseconds
const EXPIRATION_WINDOW_MS = 30 * 60 * 1000;
// Half-life decay of 10 minutes for weighting recent reports higher
const HALF_LIFE_MS = 10 * 60 * 1000;

// In-memory store persistent across requests in Next.js Node process
declare global {
  // eslint-disable-next-line no-var
  var __crowdReportsStore: CrowdReport[] | undefined;
}

if (!globalThis.__crowdReportsStore) {
  // Seed with initial baseline reports for popular transit routes so the map has immediate live data
  const now = Date.now();
  globalThis.__crowdReportsStore = [
    {
      id: "seed-1",
      busId: "500D",
      crowdLevel: "High",
      timestamp: now - 3 * 60 * 1000,
      latitude: 13.0358,
      longitude: 77.597,
      speed: 24,
    },
    {
      id: "seed-2",
      busId: "250",
      crowdLevel: "Low",
      timestamp: now - 5 * 60 * 1000,
      latitude: 13.012,
      longitude: 77.585,
      speed: 32,
    },
    {
      id: "seed-3",
      busId: "335E",
      crowdLevel: "Moderate",
      timestamp: now - 8 * 60 * 1000,
      latitude: 12.9716,
      longitude: 77.6412,
      speed: 18,
    },
  ];
}

function getStore(): CrowdReport[] {
  return globalThis.__crowdReportsStore!;
}

function pruneExpiredReports(): void {
  const cutoff = Date.now() - EXPIRATION_WINDOW_MS;
  globalThis.__crowdReportsStore = getStore().filter(
    (report) => report.timestamp > cutoff
  );
}

/**
 * Computes decayed aggregate crowd status for a bus ID.
 * Reports decay exponentially based on their age: w_i = e^(-lambda * age).
 * Reports older than 30 minutes expire completely.
 */
function computeBusCrowdStatus(
  busId: string,
  reports: CrowdReport[]
): ActiveBusStatus | null {
  const now = Date.now();
  const validReports = reports.filter(
    (r) =>
      r.busId.toLowerCase() === busId.toLowerCase() &&
      now - r.timestamp <= EXPIRATION_WINDOW_MS
  );

  if (validReports.length === 0) return null;

  // Level to numeric mapping
  const levelValues: Record<CrowdLevel, number> = {
    Low: 1.0,
    Moderate: 2.0,
    High: 3.0,
  };

  let totalWeight = 0;
  let weightedScoreSum = 0;
  let newestTimestamp = 0;

  for (const report of validReports) {
    const age = now - report.timestamp;
    // Exponential time decay weight (1.0 at 0 age, 0.5 at 10m, ~0.125 at 30m)
    const weight = Math.exp((-Math.LN2 * age) / HALF_LIFE_MS);
    const scoreVal = levelValues[report.crowdLevel] || 2.0;

    weightedScoreSum += scoreVal * weight;
    totalWeight += weight;

    if (report.timestamp > newestTimestamp) {
      newestTimestamp = report.timestamp;
    }
  }

  const averageScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 2.0;

  // Derive consolidated CrowdLevel:
  // Low: <= 1.6
  // Moderate: 1.6 < score <= 2.4
  // High: > 2.4
  let consensusLevel: CrowdLevel = "Moderate";
  let color = "#f59e0b"; // Yellow

  if (averageScore <= 1.6) {
    consensusLevel = "Low";
    color = "#10b981"; // Green
  } else if (averageScore > 2.4) {
    consensusLevel = "High";
    color = "#ef4444"; // Red
  }

  // Calculate approximate occupancy percentage (20% - 95%)
  const occupancyPercent = Math.min(
    95,
    Math.max(20, Math.round(((averageScore - 1) / 2) * 70 + 20))
  );

  // Time remaining until the newest report expires
  const oldestAllowedTimestamp = newestTimestamp + EXPIRATION_WINDOW_MS;
  const expiresInSec = Math.max(
    0,
    Math.floor((oldestAllowedTimestamp - now) / 1000)
  );

  // Sorted recent reports
  const recentReports = [...validReports]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((r) => ({
      crowdLevel: r.crowdLevel,
      timestamp: r.timestamp,
      speed: r.speed,
    }));

  return {
    busId,
    crowdLevel: consensusLevel,
    score: Math.round(averageScore * 100) / 100,
    color,
    occupancyPercent,
    reportCount: validReports.length,
    lastUpdated: newestTimestamp,
    expiresInSec,
    recentReports,
  };
}

/**
 * GET /api/crowd
 * Fetches active crowd status for all buses or a specific bus (?busId=...)
 * Automatically filters out expired reports (>30 minutes)
 */
export async function GET(request: NextRequest) {
  try {
    pruneExpiredReports();

    const { searchParams } = new URL(request.url);
    const requestedBusId = searchParams.get("busId");

    const reports = getStore();

    // Collect all distinct bus IDs
    const busIds = Array.from(
      new Set(reports.map((r) => r.busId.toUpperCase()))
    );

    const activeStatuses: Record<string, ActiveBusStatus> = {};

    for (const bId of busIds) {
      const status = computeBusCrowdStatus(bId, reports);
      if (status) {
        activeStatuses[bId] = status;
      }
    }

    if (requestedBusId) {
      const upperBusId = requestedBusId.toUpperCase();
      const status = activeStatuses[upperBusId] || null;

      return NextResponse.json({
        success: true,
        busId: upperBusId,
        status,
        timestamp: Date.now(),
        reports: reports.filter(
          (r) => r.busId.toUpperCase() === upperBusId
        ),
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      expirationWindowMinutes: 30,
      activeStatuses,
      totalActiveReports: reports.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch crowd data", details: message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crowd
 * Accepts crowd reports: { busId, crowdLevel, latitude?, longitude?, speed?, userId? }
 * Tied to a specific bus ID with 'Low', 'Moderate', or 'High'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { busId, crowdLevel, latitude, longitude, speed, userId } = body;

    // 1. Validate busId
    if (!busId || typeof busId !== "string" || busId.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "busId is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // 2. Validate crowdLevel
    const validLevels: CrowdLevel[] = ["Low", "Moderate", "High"];
    const normalizedLevel = validLevels.find(
      (lvl) => lvl.toLowerCase() === String(crowdLevel).trim().toLowerCase()
    );

    if (!normalizedLevel) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid crowdLevel. Must be one of: 'Low', 'Moderate', 'High'",
        },
        { status: 400 }
      );
    }

    // 3. Geo-validation (optional coordinates check)
    let validLat: number | undefined;
    let validLng: number | undefined;
    if (latitude !== undefined && longitude !== undefined) {
      const latNum = Number(latitude);
      const lngNum = Number(longitude);
      if (
        isNaN(latNum) ||
        isNaN(lngNum) ||
        latNum < -90 ||
        latNum > 90 ||
        lngNum < -180 ||
        lngNum > 180
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid GPS coordinates provided" },
          { status: 400 }
        );
      }
      validLat = latNum;
      validLng = lngNum;
    }

    // 4. Validate speed if provided
    let validSpeed: number | undefined;
    if (speed !== undefined) {
      const speedNum = Number(speed);
      if (!isNaN(speedNum) && speedNum >= 0 && speedNum <= 160) {
        validSpeed = Math.round(speedNum * 10) / 10;
      }
    }

    // 5. Clean up old reports (>30 min)
    pruneExpiredReports();

    // 6. Record the new report
    const newReport: CrowdReport = {
      id: `crowd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      busId: busId.trim().toUpperCase(),
      crowdLevel: normalizedLevel,
      timestamp: Date.now(),
      latitude: validLat,
      longitude: validLng,
      speed: validSpeed,
      userId: userId ? String(userId) : undefined,
    };

    const store = getStore();
    store.push(newReport);

    // Compute updated active bus status
    const currentBusStatus = computeBusCrowdStatus(newReport.busId, store);

    return NextResponse.json(
      {
        success: true,
        message: "Geo-validated crowd report successfully registered",
        report: newReport,
        currentBusStatus,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to process crowd report", details: message },
      { status: 500 }
    );
  }
}
