"use client";
import YamlEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";
// import styled from "styled-components";
import { Button } from "./Button";
import { parse, stringify } from "yaml";
import Timeline from "./Timeline";
// const ConfigEditor = styled.div`
//   width: 40%;
//   height: 100vh;
//   border: solid 1px;
// `;
export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [elements, setElements] = useState([]);

  useEffect(() => {
    let value;
    // Get the value from local storage if it exists
    value = localStorage.getItem("code") || "";
    setCode(value);
  }, []);

  function handleChange(evn) {
    setCode(evn.target.value);
    localStorage.setItem("code", evn.target.value);
    console.log(code);
  }

  function handleSave(e) {
    e.preventDefault();
    setCode(e.target.value);
    // localStorage.setItem("code", code);
    // const yamlObj = parse(code)[0];
    // console.log(yamlObj)
    // //Parse obj to extract components
    // const gameStages = yamlObj["gameStages"]; //array of each stage
    // console.log(gameStages);
    // const stageElements = {}
    // for (let i = 0; i < gameStages.length; i++) {
    //   const stage = gameStages[i];
    //   console.log(stage);
    //   //stage has a name, duration, elements
    //   const elts = stage.elements;
    //   const eltComponents = [];
    //   for (let j = 0; j < elts.length; j++) {
    //     const elt = elts[j];
    //     eltComponents.push(<Element key={j} element={elt} onSubmit={handleChange} />);
    //   }
    //   console.log(eltComponents)
    //   stageElements[stage.name] = eltComponents
    // }
    // console.log(stageElements)
    // localStorage.setItem("stageElements", JSON.stringify(stageElements))
    // setElements(stageElements)
  }
  return (
    <div>
      <div
        style={{ height: "95vh", overflow: "auto", backgroundColor: "#F0F2F6" }}
      >
        <YamlEditor
          value={code}
          language="yaml"
          placeholder="Please enter treatment configuration. Do not refresh the page before saving."
          onChange={(env) => handleChange(env)}
          padding={5}
          style={{
            fontSize: 12,
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            backgroundColor: "#F0F2F6",
          }}
        />
      </div>
      <div style={{ backgroundColor: "#F0F2F6" }}>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
      <div>
        {/* <Timeline /> */}
      </div>
    </div>
  );
}
