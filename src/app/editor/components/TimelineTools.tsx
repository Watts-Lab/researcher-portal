import React from "react";
import TimePicker from "./TimePicker";

export default function TimelineTools({ setScale }: { setScale: any }) {
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scaleValue = 10 ** (Number(e.target.value) / 100);
    setScale(scaleValue);
    localStorage.setItem('timelineScale', e.target.value); // Store the slider value
  };

  return (
    <div data-test="timelineTools" className="bg-black h-6 w-full text-white">
      <div data-test="scaleSlider" className="">
        scale:
        <input
          type="range"
          min="-100"
          max="100"
          defaultValue={localStorage.getItem('timelineScale') || "0"} // Retrieve the slider value
          id="scaleSlider"
          onChange={handleScaleChange}
        />
      </div>
    </div>
  );
}
