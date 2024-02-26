"use client";
import React, { useEffect, useState } from "react";
import { parse } from "yaml";
import { StageCard } from "./StageCard";
import AddPopup from "./AddPopup";
import TimelineTools from "./TimelineTools";

export default function Timeline({}) {
  const [scale, setScale] = useState(1); // pixels per second
  let codeStr;
  if (typeof window !== 'undefined') {
    codeStr = localStorage.getItem("code") || "";
  }
  
  const parsedCode = parse(codeStr);
  // TODO: add a page before this that lets the researcher select what treatment to work on
  
  // if we pass in a 'list' in our yaml (which we do when the treatments are in a list) then we take the first component of the treatment
  const [treatment, setTreatment] = useState(parsedCode);
  const addStageOptions = [
       {"question": "Name", "responseType": "text"},
       {"question": "Duration", "responseType": "text"},
       {"question": "Discussion", "responseType": "text"},
     ]

  return (
    <div id="timeline" className="h-full flex flex-col">
      <TimelineTools setScale={setScale} />
      <div id="timelineCanvas" className="grow min-h-10 bg-slate-600 p-2">
        <div className="flex flex-row flex-nowrap h-full overflow-x-auto gap-x-1">
          {treatment[0].gameStages?.map((stage, index) => (
            <StageCard
              key={stage.name}
              index={index}
              title={stage.name}
              elements={stage.elements}
              duration={stage.duration}
              scale={scale}
              treatment={treatment}
              setTreatment={setTreatment}
              sequence={"gameStage"}
              stageIndex={index}
            />
          ))}
          <div className="card bg-slate-300 w-12 m-1 opacity-50 flex items-center h-full">
            <button className="btn" onClick={()=>document.getElementById('add-stage').showModal()}>+</button>
            <dialog id="add-stage" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <AddPopup type="stage" questions={addStageOptions} treatment={treatment} setTreatment={setTreatment}/>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
