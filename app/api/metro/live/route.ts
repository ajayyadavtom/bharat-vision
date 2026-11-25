// app/api/metro/live/route.ts
import { NextResponse } from "next/server";
import { getActiveMetroTrains } from "@/lib/bmrclGtfsEngine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const line = searchParams.get("line") || "All";

    const trains = getActiveMetroTrains(line);

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      lineFilter: line,
      count: trains.length,
      trains,
    });
  } catch (err: any) {
    console.error("Live metro API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch live metro positions" },
      { status: 500 }
    );
  }
}
