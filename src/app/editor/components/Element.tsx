/*
A base wrapper for all the elements

*/

import React from "react";
// import { useStageTimer, useStage } from "@empirica/core/player/classic/react";
import { Prompt } from "./elements/Prompt";
import { Separator } from "./elements/Separator";
import { AudioElement } from "./elements/AudioElement";
import { Survey } from "./elements/Survey";
import { SubmitButton } from "./elements/SubmitButton";
import { KitchenTimer } from "./elements/KitchenTimer";
import { TrainingVideo } from "./elements/TrainingVideo";
import { Qualtrics } from "./elements/Qualtrics";

export function Element({ element, onSubmit }) {
  //   const stageTimer = useStageTimer();
  //   const stage = useStage();

  switch (element.type) {
    case "audio":
      return <AudioElement file={element.file} />;

    case "prompt":
      return <Prompt file={element.file} saveKey={element.name} />;

    case "qualtrics":
      return (
        <Qualtrics
          url={element.url}
          params={element.params}
          onSubmit={onSubmit}
        />
      );

    case "separator":
      return <Separator style={element.style} />;

    case "submitButton":
      return (
        <SubmitButton onSubmit={onSubmit} buttonText={element.buttonText} />
      );

    case "survey":
      return <Survey surveyName={element.surveyName} onSubmit={onSubmit} />;

    case "timer":
      if (stageTimer)
        return (
          <KitchenTimer
            startTime={element.startTime || element.displayTime || 0}
            endTime={
              element.endTime || element.hideTime || stage?.get("duration")
            }
            warnTimeRemaining={element.warnTimeRemaining}
          />
        );
      return undefined;

    case "video":
      return <TrainingVideo url={element.url} />;

    default:
      return undefined;
  }
}
