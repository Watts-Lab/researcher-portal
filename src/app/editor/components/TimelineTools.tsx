import React from "react";
import TimePicker from "./TimePicker";

export default function TimelineTools({
  sliderValue,
  setSliderValue,
}: {
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
}){
  return (
    <div data-test="timelineTools" className="bg-black h-6 w-full text-white">
      <div data-test="scaleSlider" className="">
        scale:
        <input
          type="range"
          min="-100"
          max="100"
          value={sliderValue}
          id="scaleSlider"
          onChange={(e) => {
            setSliderValue(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
}
