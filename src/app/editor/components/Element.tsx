/*
A base wrapper for all the elements

*/
import React from 'react'
import Prompt from "../elements/Prompt";
import Separator from "../elements/Separator";
import AudioElement from "../elements/AudioElement";
import Survey from "../elements/Survey";
import SubmitButton from "../elements/SubmitButton";
import KitchenTimer from "../elements/KitchenTimer";
import TrainingVideo from "../elements/TrainingVideo";
import Qualtrics from "../elements/Qualtrics";

export function Element({ element }:{ element: any }) {
  switch (element.type) {
    case "audioElement":
      return <AudioElement file={element.file} />;

    case "prompt":
      return <Prompt file={element.file} saveKey={element.name} />;

    case "qualtrics":
      return (
        <Qualtrics
          url={element.url}
          params={element.params}
          onSubmit={element.onSubmit}
        />
      );

    case "separator":
      return <Separator style={element.style} />;

    case "submitButton":
      return (
        <SubmitButton onSubmit={element.onSubmit} buttonText={element.buttonText} />
      );

    case "survey":
      return <Survey surveyName={element.name} onSubmit={element.onSubmit} />;

    case "timer":
      return (
        <KitchenTimer
          startTime={element.startTime || element.displayTime || 0}
          endTime={
            element.endTime || element.hideTime || ""
          }
          warnTimeRemaining={element.warnTimeRemaining}
        />
      );

    case "trainingVideo":
      return <TrainingVideo url={element.url} />;

    default:
      return undefined;
  }
}