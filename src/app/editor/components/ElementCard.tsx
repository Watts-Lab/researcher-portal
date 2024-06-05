import React from "react";
import { Element } from "./Element";
import AddPopup from "./AddPopup";

export function ElementCard({ element, scale, stageDuration, onSubmit, stageIndex, elementIndex, treatment, setTreatment, elementOptions}: {element: any, scale: number, stageDuration: number, onSubmit: any, stageIndex: number, elementIndex: number, treatment: any, setTreatment: any, elementOptions: any}) {
  const startTime = element.displayTime || 0;
  const endTime = element.hideTime || stageDuration;

  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px] justify-center px-5"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
      data-cy={"element-"+stageIndex+"-"+elementIndex}
    >
      <Element element={element}/>
      <button data-cy={"edit-element-button-"+stageIndex+"-"+elementIndex} className="btn h-5 flex bg-gray-300" style={{ minHeight: 'unset' }} onClick={()=>document.getElementById("stage"+stageIndex+"element"+elementIndex)?.showModal()}>Edit</button>
      <dialog id={"stage"+stageIndex+"element"+elementIndex} className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <AddPopup type="editElement" questions={elementOptions} treatment={treatment} setTreatment={setTreatment} stageIndex={stageIndex} elementIndex={elementIndex}/>
          </div>
          </dialog>
    </div>
  );
}
