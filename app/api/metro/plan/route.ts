// app/api/metro/plan/route.ts
import { NextResponse } from "next/server";
import {
  planMetroJourney,
  resolveStation,
  getAllMetroStations,
  getNextTrainTimings,
  getStationDepartureBoard,
} from "@/lib/bmrclGtfsEngine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || searchParams.get("fromStation") || "";
  const to = searchParams.get("to") || searchParams.get("toStation") || "";
  const listStations = searchParams.get("stations") === "true";

  // 1. If client wants list of all BMRCL stations
  if (listStations || (!from && !to)) {
    const all = getAllMetroStations();
    return NextResponse.json({
      success: true,
      count: all.length,
      stations: all,
    });
  }

  // 2. If only a single station is passed, return its station details, next train & live platform departure board
  if (from && !to) {
    const station = resolveStation(from);
    if (!station) {
      return NextResponse.json(
        { success: false, error: `Station '${from}' not found in BMRCL network.` },
        { status: 404 }
      );
    }
    const departureBoard = getStationDepartureBoard(station.id);
    const nextTrain = getNextTrainTimings(station.id);
    return NextResponse.json({
      success: true,
      station,
      nextTrain,
      departureBoard,
    });
  }

  // 3. Plan journey between from and to
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

  const departureBoard = getStationDepartureBoard(plan.origin.id);

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
    departureBoard,
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

    const departureBoard = getStationDepartureBoard(plan.origin.id);

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
      departureBoard,
      fare: plan.fare,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
