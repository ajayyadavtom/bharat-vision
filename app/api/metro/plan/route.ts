// app/api/metro/plan/route.ts
import { NextResponse } from "next/server";
import {
  planMetroJourney,
  resolveStation,
  getAllMetroStations,
  getNextTrainTimings,
  calculateMetroFare,
} from "@/lib/bmrclGtfsEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || searchParams.get("fromStation") || "";
  const to = searchParams.get("to") || searchParams.get("toStation") || "";
  const listStations = searchParams.get("stations") === "true";

  // If client wants list of all BMRCL stations
  if (listStations || (!from && !to)) {
    const all = getAllMetroStations();
    return NextResponse.json({
      success: true,
      count: all.length,
      stations: all,
    });
  }

  // If only a single station is passed, return its station details and next train timings
  if (from && !to) {
    const station = resolveStation(from);
    if (!station) {
      return NextResponse.json(
        { success: false, error: `Station '${from}' not found in BMRCL network.` },
        { status: 404 }
      );
    }
    const nextTrain = getNextTrainTimings(station.id, station.lines[0] === "Purple" ? "Whitefield / Challaghatta" : "Silk Institute / Madavara");
    return NextResponse.json({
      success: true,
      station,
      nextTrain,
    });
  }

  const plan = planMetroJourney(from, to);
  if (!plan) {
    return NextResponse.json(
      {
        success: false,
        error: `Could not plan route between '${from}' and '${to}'. Please verify station names.`,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    origin: plan.origin,
    destination: plan.destination,
    route: {
      lines: plan.lines,
      primaryLine: plan.primaryLine,
      routeType: plan.routeType,
      interchange: plan.interchange,
      interchanges: plan.interchanges,
      stopsCount: plan.totalStops,
      estimatedDurationMinutes: plan.totalDurationMinutes,
      path: plan.path,
    },
    nextTrain: plan.nextTrain,
    fare: plan.fare,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const from = body.from || body.fromStation || "";
    const to = body.to || body.toStation || "";

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: "Both 'fromStation' and 'toStation' are required." },
        { status: 400 }
      );
    }

    const plan = planMetroJourney(from, to);
    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not plan route between '${from}' and '${to}'.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      origin: plan.origin,
      destination: plan.destination,
      route: {
        lines: plan.lines,
        primaryLine: plan.primaryLine,
        routeType: plan.routeType,
        interchange: plan.interchange,
        interchanges: plan.interchanges,
        stopsCount: plan.totalStops,
        estimatedDurationMinutes: plan.totalDurationMinutes,
        path: plan.path,
      },
      nextTrain: plan.nextTrain,
      fare: plan.fare,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
