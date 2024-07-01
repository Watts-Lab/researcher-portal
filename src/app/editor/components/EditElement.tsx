import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TreatmentType,
  ElementType,
  elementSchema,
} from "@/../deliberation-empirica/server/src/preFlight/validateTreatmentFile";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

export function EditElement({
  treatment,
  editTreatment,
  stageIndex,
  elementIndex,
}: {
  treatment: TreatmentType;
  editTreatment: (treatment : TreatmentType) => void;
  stageIndex: number;
  elementIndex: number;
}) {
  //const [isValid, setIsValid] = useState(true)
  //var element: ElementType = treatment.gameStages[stageIndex].elements[elementIndex];  // if elementIndex is undefine, is the whole thing undefined? or does it error?

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<ElementType>(
    elementIndex !== undefined
      ? {
          defaultValues: {
            name: treatment.gameStages[stageIndex]?.elements?.[elementIndex]?.name,
            type: treatment.gameStages[stageIndex]?.elements?.[elementIndex]?.type,
            file: treatment.gameStages[stageIndex]?.elements?.[elementIndex]?.file,
          },
          resolver: zodResolver(elementSchema),
          mode: "onChange",
        }
      : {}
  );


  console.log(typeof editTreatment); // Here it's a function 
  function saveEdits() {
    //console.log(typeof editTreatment); // here it's undefined 
    try {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)); // deep copy
      if (isValid) {
        //console.log("HEEERREEE")
        if (stageIndex === undefined) {
          throw new Error("No stage index given");
        }
        if (elementIndex === undefined) {
          updatedTreatment.gameStages[stageIndex].elements.push({
            name: watch("name"),
            type: watch("type"),
            file: watch("file"),
            //TODO: to add more fields here
          });
        } else {
          updatedTreatment.gameStages[stageIndex].elements[elementIndex].name =
            watch("name");
          updatedTreatment.gameStages[stageIndex].elements[elementIndex].type =
            watch("type");
          updatedTreatment.gameStages[stageIndex].elements[elementIndex].file =
            watch("file");
          // TODO: add more fields here
        }
        console.log(typeof editTreatment);
      editTreatment(updatedTreatment);
      } else {
        throw new Error("Form is not valid");
      }
    } catch (error) {
      console.error(error);
    }
  }

    // const parseResult = elementSchema.safeParse({
    //     name: watch("name"),
    //     type: watch("type"),
    //     file: watch("file"),
    //     url: watch("url"),
    //     params: watch("params"),
    //     style: watch("style"),
    //     buttonText: watch("buttonText"),
    //     startTime: watch("startTime"),
    //     endTime: watch("endTime")
    //   })
    // if (!parseResult.success) {
    // console.log(parseResult.error)
    // window.alert( parseResult.error )
    // setIsValid(false);
    // return;
    // }

    //setIsValid(true);

  function deleteElement() {
    const confirm = window.confirm(
      "Are you sure you want to delete the element?"
    );
    if (confirm) {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)); // deep copy
      updatedTreatment.gameStages[stageIndex].elements.splice(elementIndex, 1); // delete in place
      editTreatment(updatedTreatment);
    }
  }

  // FORM QUESTIONS
  const htmlElements = [];
  htmlElements.push(
    <form onSubmit={handleSubmit(saveEdits())}>
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{"Name"}</span>
          </div>
          <input
            {...register("name", { required: true })}
            data-cy={`edit-element-name-stage${stageIndex}-element${
              elementIndex || "new"
            }`}
            placeholder="Enter text here."
            className="input input-bordered w-full max-w-xs"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </label>
      </div>

      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{"Type"}</span>
          </div>
          <select
            {...register("type", { required: true })}
            data-cy={`edit-element-type-stage${stageIndex}-element${
              elementIndex || "new"
            }`}
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

      {(watch("type") === "prompt" || watch("type") === "audioElement") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"File Address"}</span>
            </div>
            <input
              {...register("file", { required: true })}
              data-cy={`edit-element-file-stage${stageIndex}-element${
                elementIndex || "new"
              }`}
              placeholder="Enter number here."
              className="input input-bordered w-full max-w-xs"
            />
            {errors.file && (
              <span className="text-red-500">{errors.file.message}</span>
            )}
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
                data-cy={`edit-element-start-time-stage${stageIndex}-element${
                  elementIndex || "new"
                }`}
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
                data-cy={`edit-element-end-time-stage${stageIndex}-element${
                  elementIndex || "new"
                }`}
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
              data-cy={`edit-element-url-stage${stageIndex}-element${
                elementIndex || "new"
              }`}
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
              data-cy={`edit-element-params-stage${stageIndex}-element${
                elementIndex || "new"
              }`}
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
              data-cy={`edit-element-style-stage${stageIndex}-element${
                elementIndex || "new"
              }`}
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
              data-cy={`edit-element-button-text-stage${stageIndex}-element${
                elementIndex || "new"
              }`}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
    </form>
  );

  return (
    <div>
      <h1>{elementIndex !== undefined ? "Edit Element" : "Add Element"}</h1>
      {htmlElements}
      <button
        data-cy={`save-edits-stage-${stageIndex}-element-${
          elementIndex || "new"
        }`}
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={saveEdits()}
        disabled={!isValid}
      >
        Save
      </button>

      {/* Todo: Do we want to hide the delete button when creating a new element? */}
      <button
        data-cy={`delete-element-stage-${stageIndex}-element-${
          elementIndex || "new"
        }`}
        className="btn btn-secondary"
        style={{ margin: "10px" }}
        onClick={deleteElement}
      >
        {"Delete"}
      </button>
    </div>
  );
}
