import React from "react";
import { Element } from "./Element";

export function ElementCard({ element, scale, stageDuration, onSubmit }) {
  const startTime = element.displayTime || 0;
  const endTime = element.hideTime || stageDuration;

  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px] justify-center px-5"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
    >
      <Element element={element} onSubmit={onSubmit}/>
    </div>
  );
}
