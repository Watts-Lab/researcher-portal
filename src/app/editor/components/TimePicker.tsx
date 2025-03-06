import "react";
import React, { useState, useContext } from "react";
import { TimerContext } from "../timerContext";

export default function TimePicker({
  value,
  setValue,
  maxValue,
}: {
  value: any;
  setValue: any;
  maxValue: any;
}) {
  const { elapsed, setElapsed } = useContext(TimerContext);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newElapsed = Number(e.target.value);
    setElapsed(newElapsed);
  };
  return (
    <div>
      <h3>Select a time:</h3>
      <input data-test="time-picker"
        className="range"
        type="range"
        min="0"
        max={maxValue}
        value={value}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))}
      />
      {Math.min(value, maxValue)} s
    </div>
  );
}