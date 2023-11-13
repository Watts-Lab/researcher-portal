"use client";
import React from "react";
import { parse, stringify } from "yaml";
import { Element } from "./Element";
import { useState } from "react";

export default function Timeline({}) {
    const [elements, SetElements] = useState({});
    const yamlObj = parse(localStorage.getItem("code"))[0];
    console.log(yamlObj)
    //Parse obj to extract components
    const gameStages = yamlObj["gameStages"]; //array of each stage
    console.log(gameStages);
    const stageElements = {}
    for (let i = 0; i < gameStages?.length; i++) {
      const stage = gameStages[i];
      console.log(stage);
      //stage has a name, duration, elements
      const elts = stage.elements;
      const eltComponents = [];
      for (let j = 0; j < elts.length; j++) {
        const elt = elts[j];
        console.log(elt)
        eltComponents.push(<Element key={j} element={elt} onSubmit={() => {}} />);
      }
      console.log(eltComponents)
      eltComponents.push(<button>click me</button>)
      stageElements[stage.name] = eltComponents
    }
    console.log(stageElements)

    // localStorage.setItem("stageElements", JSON.stringify(stageElements))
    // setElements(stageElements)
    // const stringElements = localStorage.getItem("stageElements") || ""
    // const stageElements = JSON.parse(stringElements)
    // console.log(stageElements["Topic Survey"])
    return(
        <div>
            {stageElements["Topic Survey"]}
            <p>here</p>
        </div>
    )
}