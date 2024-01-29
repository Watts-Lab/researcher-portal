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
  //const [elements, setElements] = useState([]);
  useEffect(() => {
    let value;
    // Get the value from local storage if it exists
    value = localStorage.getItem("code") || "";
    setCode(value);
  }, []);

  function handleChange(evn) {
    let entry = evn.target.value
    try {
      parse(entry);
    } catch {
      entry = code
      //TODO also display a little something went wrong pop up
    }
    setCode(entry);
    localStorage.setItem("code", entry);
    console.log(code);
  }

  function handleSave(e) { //TODO validation should occur here
    e.preventDefault();
    window.location.reload(false) //refresh page to make elements appear on screen
  }
  return (
    <div>
      <div
        style={{ height: "95vh", overflow: "auto", backgroundColor: "#F0F2F6" }}
      >
        <YamlEditor
          value={code}
          language="yaml"
          placeholder={"Please enter treatment configuration. Do not refresh the page before saving."}
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
      <div>{/* <Timeline /> */}</div>
    </div>
  );
}
