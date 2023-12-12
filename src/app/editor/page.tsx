"use client";
import React from "react";
import { useResizable } from "react-resizable-layout";
import DraggableSplitter from "../components/DraggableSplitter";
// import CodeEditor from "./components/CodeEditor";
import CodeEditor from "./components/CodeEditor";
import Timeline from "./components/Timeline";
import AddPopup from "./components/AddPopup";

export default function EditorPage({}) {
  const { position: codeWidth, separatorProps: codeSeparatorProps } =
    useResizable({
      axis: "x",
      initial: 400,
      min: 100,
      reverse: true,
    });

  const { position: timelineHeight, separatorProps: timelineSeparatorProps } =
    useResizable({
      axis: "y",
      initial: 500,
      min: 100,
      reverse: true,
    });

  return (
    <div id="editor" className="flex w-full h-full">
      <div id="leftColumn" className="flex grow flex-col">
        <div id="tophalf" className="grow overflow-y-auto scroll-smooth">
          <h1>Render Panel </h1>
          <p>{"Lorem Ipsum ".repeat(100)}</p>
        </div>

        <DraggableSplitter dir="horizontal" {...timelineSeparatorProps} />

        <div
          id="timeline"
          className="shrink-0 bottom-0 overflow-x-auto scroll-smooth"
          style={{ height: timelineHeight }}
        >
          <Timeline/>
        </div>
        <div>
          <AddPopup questions={[]} type={"stage"}/>
        </div>
      </div>

      <DraggableSplitter dir="vertical" {...codeSeparatorProps} />

      <div
        id="code"
        className="shrink-0 overflow-auto scroll-smooth"
        style={{ width: codeWidth }}
      >
        <CodeEditor/>
      </div>
    </div>
  );
}
