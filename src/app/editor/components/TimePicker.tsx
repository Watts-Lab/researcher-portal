import "react";
import { useState, useContext, memo } from "react";
import { TimerContext } from '../TimerContext';

interface TimePickerProps {
  maxValue: number;
}

const TimePicker = ({ maxValue }: TimePickerProps) => {
  const { elapsed, setElapsed } = useContext(TimerContext);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newElapsed = Number(e.target.value);
    setElapsed(newElapsed);
  };
  return (
    <div>
      <h3>Select a time:</h3>
      <input
        className="range"
        type="range"
        min="0"
        max={maxValue}
        value={elapsed > maxValue ? maxValue : elapsed}
        onChange={handleChange}
      />
      <span>{elapsed > maxValue ? maxValue : elapsed} s</span>
    </div>
  );
}

export default memo(TimePicker);

