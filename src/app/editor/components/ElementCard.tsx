import React from "react";

export function ElementCard({ element, scale, stageDuration }) {
  const startTime = element.displayTime || 0;
  const endTime = element.hideTime || stageDuration;

  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px] justify-center px-5"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
    >
      <p>
        <span className="text-black"> {element.name}</span>
        <span className="text-slate-500"> {element.type}</span>
        <span className="text-blue-500"> {element.file}</span>
      </p>
    </div>
  );
}
