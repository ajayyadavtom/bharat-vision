"use client";

import React from "react";
import GoogleNavSystem from "./GoogleNavSystem";

interface MapProps {
  initialDestination?: [number, number];
  destinationName?: string;
  className?: string;
  showQuickHubs?: boolean;
}

export default function Map({
  initialDestination = [12.9781, 77.5695],
  destinationName = "Kempegowda Bus Station (Majestic)",
  className = "w-full h-full min-h-[450px]",
}: MapProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <GoogleNavSystem
        initialDestination={{
          name: destinationName,
          coords: initialDestination,
        }}
      />
    </div>
  );
}
