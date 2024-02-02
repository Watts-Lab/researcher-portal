"use client";
import AddElementPopup from "./AddElementPopup";
import { parse, stringify } from "yaml";
import { useState } from "react";

// const TitleWrapper = styled.div`
//     flex-grow: 0;
// `

// const ComponentContainer = styled.div`
//     background: #D9DDEA;
//     border: solid 1px;
//     padding: 10px;
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
// `

// const ComponentWrapper = styled.div`
//     padding: 5px;
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
//     align-items: stretch
// `

// const TimeWrapper = styled.div``

function Element({ element, scale, stageDuration }) {
  console.log(element);
  // TODO: add a left and right side dragger so that people can adjust the timing as necessary
  // Display element contents in a formatted way

  const left = (element.displayTime ? element.displayTime : 0) * scale; // in pixels
  const right = (element.hideTime ? element.hideTime : stageDuration) * scale; // in pixels
  const width = right - left; //in pixels

  return (
    <div
      className="card bg-slate-100 shadow-md m-1 min-h-12 min-w-[10px]"
      style={{ "margin-left": left, width: width }}
    >
      {element.type}
    </div>
  );
}

export function Stage({ title, elements, duration, scale, treatment, setTreatment}) {
  {/* Options for AddElementPopup*/}
  const addElementOptions = [
    {"question": "Name", "responseType": "text"},
    {"question": "Type", "responseType": "dropdown", "options": ["prompt", "survey"]},
  ]

  //console.log("elements", elements);
  return (
    // TODO: reorder elements with drag and drop
    <div
      className="card bg-slate-300 flex flex-col space-y-4 m-1 h-full min-w-[10px]"
      style={{ width: scale * duration }}
    >
      {" "}
      {/* stage card */}
      <h3>{title}</h3>
      {elements.map((element) => (
        <Element element={element} scale={scale} stageDuration={duration} />
      ))}
      {/* Add Element Button*/}
      <div className="card bg-slate-100 opacity-50  shadow-md m-1 min-h-12 flex items-center">
        <button className="btn h-full w-full" onClick={()=>document.getElementById('add-element').showModal()}>+</button>
        <dialog id="add-element" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <AddElementPopup type="Element" questions={addElementOptions} treatment={treatment} setTreatment={setTreatment}/>
        </div>
        </dialog>
      </div>
    </div>

    // <div
    //   style={{
    //     width: scale * duration,
    //     minHeight: "100vh",
    //     minWidth: "100px",
    //     display: "flex",
    //     flexDirection: "column",
    //     padding: "10px",
    //   }}
    // >
    //   <h3>{title}</h3>
    //   <div
    //     style={{
    //       background: "#D9DDEA",
    //       border: "solid 1px",
    //       padding: "10px",
    //       height: "100vh",
    //       display: "flex",
    //       flexDirection: "column",
    //     }}
    //   >
    //     <div
    //       style={{
    //         padding: "5px",
    //         height: "100vh",
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "stretch",
    //       }}
    //     >
    //       {elements.map((element) => (
    //         <Element element={element} />
    //       ))}
    //     </div>
    //     <button> Add Component </button>
    //   </div>
    //   <div>{duration}</div>
    // </div>
  );
}
