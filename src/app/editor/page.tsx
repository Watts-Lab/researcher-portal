"use client";
import React, { useRef, useState, useEffect } from "react";
import { useResizable } from "react-resizable-layout";
import DraggableSplitter from "../components/DraggableSplitter";
// import CodeEditor from "./components/CodeEditor";
import CodeEditor from "./components/CodeEditor";
import Timeline from "./components/Timeline";
import AddPopup from "./components/AddPopup";

export default function EditorPage({}) {
  const { position: leftWidth, separatorProps: codeSeparatorProps } =
    useResizable({
      axis: "x",
      initial: 400,
      min: 100,
    });

  const { position: upperLeftHeight, separatorProps: timelineSeparatorProps } =
    useResizable({
      axis: "y",
      initial: 500,
      min: 100,
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
          style={{ height: upperLeftHeight }}
        >
          <h1>Render Panel </h1>
          <p>{"Lorem Ipsum ".repeat(100)}</p>
        </div>

        <DraggableSplitter dir="horizontal" {...timelineSeparatorProps} />

        <div id="lowerLeft" className="grow">
          <Timeline />
        </div>
        <div>
          <AddPopup questions={[]} type={"stage"}/>
        </div>
      </div>

      <DraggableSplitter dir="vertical" {...codeSeparatorProps} />

      <div id="rightColumn" className="grow">
        <CodeEditor />
      </div>
    </div>
  );
}
