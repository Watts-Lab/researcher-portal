import React from "react";
import { useState } from "react";
import { stringify } from "yaml";
import { useForm } from "react-hook-form";

export default function AddPopup({
  type,
  questions,
  treatment,
  setTreatment,
  stageIndex,
  elementIndex,
}: {
  type: string;
  questions: any;
  treatment: any;
  setTreatment: any;
  stageIndex: any;
  elementIndex: any;
}) {
  var currComponent;
  if (type === "editElement") {
    currComponent = treatment.gameStages[stageIndex].elements[elementIndex];
  } else if (type === "editStage") {
    currComponent = treatment.gameStages[stageIndex];
  }

  const { register, watch } = useForm({
    defaultValues: {
      name:
        currComponent !== undefined && currComponent.name !== undefined
          ? currComponent.name
          : "",
      duration:
        currComponent !== undefined && currComponent.duration !== undefined
          ? currComponent.duration
          : "",
      selectedOption:
        currComponent !== undefined && currComponent.type !== undefined
          ? currComponent.type
          : "Pick one",
      file: "",
      url: "",
      params: "",
      onSubmit: "",
      style: "",
      buttonText: "",
      startTime: "",
      endTime: "",
    },
  });

  function handleSave(saveType: string) {
    const updatedTreatment = { ...treatment };

    if (saveType === "addStage") {
      const inputs = {
        name: watch("name"),
        duration: parseInt(watch("duration")),
        elements: [],
      };
      updatedTreatment?.gameStages?.push(inputs);
    } else if (saveType === "editStage") {
      const stageElmts = updatedTreatment.gameStages[stageIndex].elements;
      const inputs = {
        name: watch("name"),
        duration: parseInt(watch("duration")),
        elements: [],
      };
      updatedTreatment.gameStages[stageIndex] = inputs;
      updatedTreatment.gameStages[stageIndex].elements = stageElmts;
    } else if (saveType === "addElement" || saveType === "editElement") {
      const inputs: { name: any; type: any; [key: string]: any } = {
        name: watch("name"),
        type: watch("selectedOption"),
      };
      if (watch("file") !== "") inputs.file = watch("file");
      if (watch("url") !== "") inputs.url = watch("url");
      if (watch("params") !== "") inputs.params = watch("params");
      if (watch("onSubmit") !== "") inputs.onSubmit = watch("onSubmit");
      if (watch("style") !== "") inputs.style = watch("style");
      if (watch("buttonText") !== "") inputs.buttonText = watch("buttonText");
      if (watch("startTime") !== "") inputs.startTime = watch("startTime");
      if (watch("endTime") !== "") inputs.endTime = watch("endTime");

      if (saveType === "addElement") {
        updatedTreatment?.gameStages[stageIndex]?.elements?.push(inputs);
      } else if (type === "editElement") {
        updatedTreatment.gameStages[stageIndex].elements[elementIndex] = inputs;
      }
    } else if (saveType === "deleteElement") {
      const oldElements = {
        ...updatedTreatment.gameStages[stageIndex].elements,
      };
      var newElements: any[] = [];
      Object.keys(oldElements).forEach((key) => {
        if (key != elementIndex) {
          newElements.push(oldElements[key]);
        }
      });
      updatedTreatment.gameStages[stageIndex].elements = newElements;
    } else if (saveType === "deleteStage") {
      const oldStages = { ...updatedTreatment.gameStages };
      var newStages: any[] = [];
      Object.keys(oldStages).forEach((key) => {
        if (key != stageIndex) {
          newStages.push(oldStages[key]);
        }
      });
      updatedTreatment.gameStages = newStages;
    }

    setTreatment(updatedTreatment);

    /*
    const addElementDialog = document.getElementById('add-element');
    if (addElementDialog) {
      addElementDialog.close();
    }
    */

    localStorage.setItem("code", stringify(updatedTreatment));
    window.location.reload();
  }

  // FORM QUESTIONS
  stageIndex = stageIndex !== undefined ? stageIndex : "";

  elementIndex = elementIndex !== undefined ? elementIndex : "";

  const htmlElements = [];
  htmlElements.push(
    <form>
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{"Name"}</span>
          </div>
          <input
            {...register("name", { required: true })}
            data-cy={
              "add-popup-name-" + type + "-" + stageIndex + "-" + elementIndex
            }
            placeholder="Enter text here."
            className="input input-bordered w-full max-w-xs"
          />
        </label>
      </div>

      {(type === "editStage" || type === "addStage") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Duration"}</span>
            </div>
            <input
              {...register("duration", { required: true })}
              data-cy={
                "add-popup-duration-" +
                type +
                "-" +
                stageIndex +
                "-" +
                elementIndex
              }
              placeholder="Enter number here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {(type === "editElement" || type === "addElement") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Type"}</span>
            </div>
            <select
              {...register("selectedOption", { required: true })}
              data-cy={
                "add-popup-type-" + type + "-" + stageIndex + "-" + elementIndex
              }
              className="select select-bordered"
            >
              <option disabled>Pick one</option>
              <option value="prompt">Prompt</option>
              <option value="survey">Survey</option>
              <option value="audioElement">Audio Element</option>
              <option value="kitchenTimer">Kitchen Timer</option>
              <option value="qualtrics">Qualtrics</option>
              <option value="separator">Separator</option>
              <option value="submitButton">Submit Button</option>
              <option value="trainingVideo">Training Video</option>
            </select>
          </label>
        </div>
      )}

      {(watch("selectedOption") === "prompt" ||
        watch("selectedOption") === "audioElement") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"File Address"}</span>
            </div>
            <input
              {...register("file", { required: true })}
              data-cy={
                "add-popup-fileAddress-" +
                type +
                "-" +
                stageIndex +
                "-" +
                elementIndex
              }
              placeholder="Enter number here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {watch("selectedOption") === "kitchenTimer" && (
        <div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{"Start Time"}</span>
              </div>
              <input
                {...register("startTime", { required: true })}
                placeholder="Enter text here."
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{"End Time"}</span>
              </div>
              <input
                {...register("endTime", { required: true })}
                placeholder="Enter text here."
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        </div>
      )}

      {(watch("selectedOption") === "qualtrics" ||
        watch("selectedOption") === "trainingVideo") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"URL"}</span>
            </div>
            <input
              {...register("url", { required: true })}
              data-cy={
                "add-popup-URL-" + type + "-" + stageIndex + "-" + elementIndex
              }
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {watch("selectedOption") === "qualtrics" && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Parameters"}</span>
            </div>
            <input
              {...register("params", { required: true })}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {watch("selectedOption") === "separator" && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Style"}</span>
            </div>
            <input
              {...register("style", { required: true })}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {(watch("selectedOption") === "survey" ||
        watch("selectedOption") === "qualtrics" ||
        watch("selectedOption") === "submitButton") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"On Submit"}</span>
            </div>
            <input
              {...register("onSubmit", { required: true })}
              data-cy={
                "add-popup-onSubmit-" +
                type +
                "-" +
                stageIndex +
                "-" +
                elementIndex
              }
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}

      {watch("selectedOption") === "submitButton" && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Button Text"}</span>
            </div>
            <input
              {...register("buttonText", { required: true })}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
    </form>
  );

  var header;
  if (type === "editElement") {
    header = "Edit Element";
  } else if (type === "addElement") {
    header = "Add Element";
  } else if (type === "addStage") {
    header = "Add Stage";
  } else if (type === "editStage") {
    header = "Edit Stage";
  }

  //console.log(watch()); // WATCH ALL INPUTS

  return (
    <div>
      <h1>{header}</h1>
      {htmlElements}
      <button
        data-cy={
          "add-popup-save-" + type + "-" + stageIndex + "-" + elementIndex
        }
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={() => handleSave(type)}
        disabled={
          (watch("duration") === "" || watch("name") === "") &&
          (watch("selectedOption") === "Pick one" || watch("name") === "")
        }
      >
        Save
      </button>
      {type === "editElement" && (
        <button
          data-cy={
            "add-popup-delete-" + type + "-" + stageIndex + "-" + elementIndex
          }
          className="btn btn-secondary"
          style={{ margin: "10px" }}
          onClick={() => handleSave("deleteElement")}
        >
          {"Delete"}
        </button>
      )}
      {type === "editStage" && (
        <button
          data-cy={
            "add-popup-delete-" + type + "-" + stageIndex + "-" + elementIndex
          }
          className="btn btn-secondary"
          style={{ margin: "10px" }}
          onClick={() => handleSave("deleteStage")}
        >
          {"Delete"}
        </button>
      )}
    </div>
  );
}
