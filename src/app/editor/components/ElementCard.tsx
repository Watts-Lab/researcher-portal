import React from "react";

export function ElementCard({ element, scale, stageDuration }) {
  const startTime = element.displayTime || 0;
  const endTime = element.hideTime || stageDuration;

  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px]"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
    >
      <p>{element.name}</p>
      <p>{element.type}</p>
    </div>
  );
}
