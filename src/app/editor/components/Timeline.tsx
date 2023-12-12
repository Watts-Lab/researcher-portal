"use client";
import React, { useState } from "react";
import { parse, stringify } from "yaml";
import { StageCard } from "./StageCard";
import TimelineTools from "./TimelineTools";

export default function Timeline({}) {
  const [scale, setScale] = useState(1); // pixels per second
  const codeStr = localStorage.getItem("code") || "";
  const parsedCode = parse(codeStr);
  // TODO: add a page before this that lets the researcher select what treatment to work on
  // if we pass in a 'list' in our yaml (which we do when the treatments are in a list) then we take the first component of the treatment
  const treatment = parsedCode ? parsedCode[0] : {};
  console.log("parsed", parsedCode);

  return (
    <div id="timeline" className="h-full flex flex-col">
      <TimelineTools setScale={setScale} />
      <div id="timelineCanvas" className="grow min-h-10 bg-slate-600 p-2">
        <div className="flex flex-row flex-nowrap h-full overflow-x-auto gap-x-1">
          {treatment?.gameStages?.map((stage, index) => (
            <StageCard
              key={stage.name}
              index={index}
              title={stage.name}
              elements={stage.elements}
              duration={stage.duration}
              scale={scale}
            />
          ))}
          <div
            id="newStage"
            className="card bg-slate-300 shrink-0 w-6 h-full opacity-50 text-center justify-center"
          >
            <p>+</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function Timeline({}) {
//   const [elements, SetElements] = useState({});
//   const codeStr = localStorage.getItem("code") || "";
//   const parsedCode = parse(codeStr);
//   const yamlObj = parsedCode ? parsedCode[0] : {};
//   // console.log("code", parsedCode);
//   // console.log("parsed YAML", yamlObj);
//   //Parse obj to extract components
//   const gameStages = yamlObj["gameStages"]; //array of each stage
//   // console.log("game stages", gameStages);
//   const stageElements = {};
//   for (let i = 0; i < gameStages?.length; i++) {
//     const stage = gameStages[i];
//     // console.log("stage", stage);
//     //stage has a name, duration, elements
//     const elts = stage.elements;
//     const eltComponents = [];
//     for (let j = 0; j < elts.length; j++) {
//       const elt = elts[j];
//       // console.log("element", elt);
//       eltComponents.push(<Element key={j} element={elt} onSubmit={() => {}} />);
//     }
//     console.log(eltComponents);
//     eltComponents.push(<button>click me</button>);
//     stageElements[stage.name] = eltComponents;
//   }
//   console.log("stageElements", stageElements);

//   // localStorage.setItem("stageElements", JSON.stringify(stageElements))
//   // setElements(stageElements)
//   // const stringElements = localStorage.getItem("stageElements") || ""
//   // const stageElements = JSON.parse(stringElements)
//   // console.log(stageElements["Topic Survey"])
//   return (
//     <div>
//       {/* {stageElements["Topic Survey"]} */}
//       <Stage title="Topic Survey" component={elements} duration="30s" />
//       <p>here</p>
//     </div>
//   );
// }
