import React from "react";
import TimePicker from "./TimePicker";

export default function TimelineTools({ setScale }) {
  return (
    <div data-test="timelineTools" className="bg-black h-6 w-full text-white">
      <div data-test="scaleSlider" className="">
        scale:
        <input
          type="range"
          min="-100"
          max="100"
          defaultValue="0"
          id="scaleSlider"
          onChange={(e) => setScale(10 ** (e.target.value / 100))}
        />
      </div>
    </div>
  );
}
