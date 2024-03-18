"use client";
import React from "react";
import { useResizable } from "react-resizable-layout";
import DraggableSplitter from "../components/DraggableSplitter";
import CodeEditor from "./components/CodeEditor";
import Timeline from "./components/Timeline";

export default function EditorPage({}) {
  const { position: leftWidth, separatorProps: codeSeparatorProps } =
    useResizable({
      axis: "x",
      initial: 1000,
      min: 100,
    });

  const { position: upperLeftHeight, separatorProps: timelineSeparatorProps } =
    useResizable({
      axis: "y",
      initial: 500
    });

  return (
    <div id="editor" className="flex flex-row h-full w-full">
      <div
        id="leftColumn"
        className="flex flex-col h-full w-full"
        style={{ width: leftWidth }} 
      >
        <div
          id="upperLeft"
          className="overflow-auto h-full w-full"
          style={{minHeight: 200, height: upperLeftHeight }}
        >
          <h1>Render Panel </h1>
          <p>{"Lorem Ipsum ".repeat(100)}</p>
        </div>

        <DraggableSplitter dir="horizontal" {...timelineSeparatorProps} />

        <div id="lowerLeft" className="grow overflow-auto">
          <Timeline />
        </div>
      </div>

      <DraggableSplitter dir="vertical" {...codeSeparatorProps} />

      <div id="rightColumn" className="grow">
        <CodeEditor />
      </div>
    </div>
  );
}
