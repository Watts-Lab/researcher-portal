import React from "react";
import CodeEditor from "./components/CodeEditor";
import Timeline from "./components/Timeline";

export default function EditorPage({}) {
  return (
    <div id="editor" className="flex w-full h-full">
      <div id="leftColumn" className="bg-gray-500 flex flex-col grow">
        <div id="leftColumnTop" className="bg-sky-500 m-5 h-1/2">
          left top
        </div>
        <div id="leftColumnBottom" className="bg-red-500 m-5 h-1/2">
          <Timeline />
        </div>
      </div>
      <div id="rightColumn" className="bg-green-500 m-5 w-1/3">
        <CodeEditor />
        right
      </div>
    </div>
  );
}
