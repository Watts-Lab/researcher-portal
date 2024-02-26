"use client";
import AddElementPopup from "./AddElementPopup";
import React from "react";
import { ElementCard } from "./ElementCard";
import { cn } from "@/app/components/utils";

export function StageCard({
  title,
  elements,
  duration,
  scale,
  index,
  treatment,
  setTreatment,
  sequence,
  stageIndex
}) {
  const addElementOptions = [
    {"question": "Name", "responseType": "text"},
    {"question": "Type", "responseType": "dropdown", "options": ["prompt", "survey", "audioElement", "kitchenTimer", "qualtrics", "separator", "submitButton", "trainingVideo"]},
  ]

  const width = duration ? scale * duration : "auto";
  return (
    // TODO: reorder elements with drag and drop
    <div
      id={`timelineCard ${index}`}
      className={cn(
        "card grow-0 shrink-0",
        sequence === "gameStage" ? "bg-slate-300" : "bg-red-300"
      )}
      style={{ width: scale * duration }}
    >
      <h3 className="mx-3 my-2">{title}</h3>
      <div id="elementList" className="flex flex-col gap-y-1">
        {elements.map((element, index) => (
          <ElementCard
            key={`element ${index}`}
            element={element}
            scale={scale}
            stageDuration={duration}
          />
        ))}
        {/* Add Element Button*/}
        <div className="card bg-slate-100 opacity-50  shadow-md m-1 min-h-12 flex items-center">
          <button className="btn h-full w-full" onClick={()=>document.getElementById(stageIndex).showModal()}>+</button>
          <dialog id={stageIndex} className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <AddElementPopup type="Element" questions={addElementOptions} treatment={treatment} setTreatment={setTreatment} index={stageIndex}/>
          </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
