"use client";
import React from "react";
import { parse, stringify } from "yaml";
import { Element } from "./Element";
import { useState } from "react";
import { Stage } from "./Stage";

export default function Timeline({}) {
  const scale = 1; //pixels per second
  const codeStr = localStorage.getItem("code") || "";
  const parsedCode = parse(codeStr);
  // TODO: add a page before this that lets the researcher select what treatment to work on
  // if we pass in a 'list' in our yaml (which we do when the treatments are in a list) then we take the first component of the treatment
  const treatment = parsedCode ? parsedCode[0] : {};
  console.log("parsed", parsedCode);

  return (
    <div className="flex flex-row bg-slate-600 h-full pb-5">
      {treatment?.gameStages?.map((stage) => (
        <Stage
          key={stage.name}
          title={stage.name}
          elements={stage.elements}
          duration={stage.duration}
          scale={scale}
        />
      ))}
      <div className="card bg-slate-300 w-12 m-1 opacity-50 flex items-center h-full">
        <p className="text-center align-middle">+</p>
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
