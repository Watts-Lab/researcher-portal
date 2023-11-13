import React from "react";

export default function KitchenTimer({
  startTime,
  endTime,
  warnTimeRemaining,
}) {
  return (
    <div>
      <h1> Audio Element </h1>
      <p> `startTime: ${startTime}` </p>
      <p> `endTime: ${endTime}` </p>
      <p> `warnTimeRemaining: ${warnTimeRemaining}` </p>
    </div>
  );
}
