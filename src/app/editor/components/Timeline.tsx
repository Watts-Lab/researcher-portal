"use client";
import React, { useState } from "react";
import { parse, stringify } from "yaml";
import { StageCard } from "./StageCard";
import TimelineTools from "./TimelineTools";
import { cn } from "@/app/components/utils";

export default function Timeline({}) {
  const [scale, setScale] = useState(1); // pixels per second
  const codeStr = localStorage.getItem("code") || "";
  const parsedCode = parse(codeStr);
  // TODO: add a page before this that lets the researcher select what treatment to work on
  // if we pass in a 'list' in our yaml (which we do when the treatments are in a list) then we take the first component of the treatment
  const treatment = parsedCode ? parsedCode[0] : {};
  console.log("parsed", parsedCode);

  const renderAddStage = ({ sequence }) => {
    return (
      <div
        id="newStage"
        className={cn(
          "card shrink-0 w-6 h-full opacity-50 text-center justify-center",
          sequence === "gameStage" ? "bg-slate-300" : "bg-red-300",
          "hover:opacity-80"
        )}
      >
        <p>+</p>
      </div>
    );
  };

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
              sequence={"gameStage"}
            />
          ))}
          {renderAddStage({ sequence: "gameStage" })}

          {treatment?.exitSequence?.map((stage, index) => (
            <StageCard
              key={stage.name}
              index={index}
              title={stage.name}
              elements={stage.elements}
              duration={stage.duration}
              scale={scale}
              sequence={"exitStep"}
            />
          ))}
          {renderAddStage({ sequence: "exit" })}
        </div>
      </div>
    </div>
  );
}
