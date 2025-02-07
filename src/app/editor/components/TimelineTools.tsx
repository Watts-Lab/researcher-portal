import React from "react";
import TimePicker from "./TimePicker";

export default function TimelineTools({
  scale,
  setScale,
}: {
  scale: number;
  setScale: (scale: number) => void;
}){
  return (
    <div data-test="timelineTools" className="bg-black h-6 w-full text-white">
      <div data-test="scaleSlider" className="">
        scale:
        <input
          type="range"
          min="-100"
          max="100"
          value={Math.log10(scale) * 100}
          id="scaleSlider"
          onChange={(e) => {
            const newScale = 10 ** (Number(e.target.value) / 100);
            setScale(newScale);
          }}
        />
      </div>
    </div>
  );
}
