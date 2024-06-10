"use client";
import AddPopup from "./AddPopup";
import React from "react";
import { ElementCard } from "./ElementCard";
import { cn } from "@/app/components/utils";

export function StageCard({
  title,
  elements,
  duration,
  scale,
  treatment,
  setTreatment,
  sequence,
  stageIndex,
  setRenderPanelStage
} : {
  title: string,
  elements: any[],
  duration: number,
  scale: number,
  treatment: any,
  setTreatment: any,
  sequence: string,
  stageIndex: number,
  setRenderPanelStage: any
}) {
  const addElementOptions = [
    {"question": "Name", "responseType": "text"},
    {"question": "Type", "responseType": "dropdown", "options": ["prompt", "survey", "audioElement", "kitchenTimer", "qualtrics", "separator", "submitButton", "trainingVideo"]},
  ]
  const addStageOptions = [
    {"question": "Name", "responseType": "text"},
    {"question": "Duration", "responseType": "text"},
    {"question": "Discussion", "responseType": "text"},
  ]

  const width = duration ? scale * duration : "auto";

  function handleStageClick() {
    setRenderPanelStage(
      {
        title: title,
        elements: elements,
        duration: duration,
        stageIndex: stageIndex
      }
    )
  }

  return (
    // TODO: reorder elements with drag and drop
    <div
      id={`timelineCard ${stageIndex}`}
      className={cn(
        "card grow-0 shrink-0",
        sequence === "gameStage" ? "bg-slate-300" : "bg-red-300"
      )}
      style={{ width: scale * duration }}
      onClick={handleStageClick}
      data-cy={"stage-"+stageIndex}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 className="mx-3 my-2">{title}</h3>
        <button data-cy={"edit-stage-button-"+stageIndex} className="my-3 mx-3 btn h-5 bg-gray-300" style={{ minHeight: 'unset'}} onClick={() => (document.getElementById("stage"+stageIndex) as HTMLDialogElement | null)?.showModal()}
        >Edit</button>
        <dialog id={"editStage"+stageIndex} className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <AddPopup type="editStage" questions={addStageOptions} treatment={treatment} setTreatment={setTreatment} stageIndex={stageIndex} elementIndex={""}/>
          </div>
          </dialog>
      </div>

      <div id="elementList" className="flex flex-col gap-y-1">
        {elements !== undefined && elements.map((element, index) => (
          <ElementCard
            key={`element ${index}`}
            element={element}
            scale={scale}
            stageDuration={duration}
            stageIndex={stageIndex}
            elementIndex={index}
            treatment={treatment}
            setTreatment={setTreatment}
            elementOptions={addElementOptions}
            onSubmit={""}
          />
        ))}
        {/* Add Element Button*/}
        <div className="card bg-slate-100 opacity-50 shadow-md m-1 min-h-12 flex items-center">
          <button data-cy={"add-element-button-"+stageIndex} className="btn h-full w-full" onClick={() => (document.getElementById("stage"+stageIndex) as HTMLDialogElement | null)?.showModal()}>+</button>
          <dialog id={"stage"+stageIndex} className="modal">  
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <AddPopup type="addElement" questions={addElementOptions} treatment={treatment} setTreatment={setTreatment} stageIndex={stageIndex} elementIndex={""}/>
          </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
