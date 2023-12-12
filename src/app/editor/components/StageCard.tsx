"use client";

import React from "react";
import { ElementCard } from "./ElementCard";
import { cn } from "@/app/components/utils";

export function StageCard({
  title,
  elements,
  duration,
  scale,
  index,
  sequence,
}) {
  console.log("elements", elements);

  const width = duration ? scale * duration : "auto";
  return (
    // TODO: reorder elements with drag and drop
    <div
      id={`timelineCard ${index}`}
      className={cn(
        "card grow-0 shrink-0",
        sequence === "gameStage" ? "bg-slate-300" : "bg-red-300"
      )}
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
        <div
          className={cn(
            "card shadow-md bg-base-200 min-h-6 min-w-[10px] opacity-40 text-center justify-center",
            "hover:opacity-80"
          )}
        >
          <span>+</span>
        </div>
      </div>
    </div>
  );
}
