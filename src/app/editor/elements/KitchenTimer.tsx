import React from "react";

export default function KitchenTimer({
  startTime,
  endTime,
  warnTimeRemaining,
} : {
  startTime : any
  endTime : any
  warnTimeRemaining : any
}) {
  return (
    <div>
      <h1> Audio Element </h1>
      <p> Start Time: {startTime} </p>
      <p> End Time: {endTime} </p>
      <p> Warn Time Remaining: {warnTimeRemaining} </p>
    </div>
  );
}
