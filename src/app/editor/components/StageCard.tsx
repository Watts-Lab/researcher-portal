"use client";

import React from "react";
import { ElementCard } from "./ElementCard";

export function StageCard({ title, elements, duration, scale, index }) {
  console.log("elements", elements);
  return (
    // TODO: reorder elements with drag and drop
    <div
      id={`timelineCard ${index}`}
      className="card grow-0 shrink-0 bg-slate-300"
      style={{ width: scale * duration }}
    >
      <h3 className="mx-3 my-2">{title}</h3>
      <div id="elementList" className="flex flex-col gap-y-1">
        {elements.map((element, index) => (
          <ElementCard
            key={`element ${index}`}
            element={element}
            scale={scale}
            stageDuration={duration}
          />
        ))}
        <div className="card bg-base-200 shadow-md min-h-6 min-w-[10px] opacity-40 text-center justify-center">
          <span>+</span>
        </div>
      </div>
    </div>
  );
}
