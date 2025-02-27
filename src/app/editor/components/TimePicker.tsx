import "react";
import { useState } from "react";

export default function TimePicker({
  value,
  setValue,
  maxValue,
}: {
  value: number;
  setValue: (value: number) => void;
  maxValue: number;
}) {
  return (
    <div>
      <h3>Select a time:</h3>
      <input
        className="range"
        type="range"
        min="0"
        max={maxValue}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      {value} s
    </div>
  );
}