import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { TreatmentType, ElementType, elementSchema } from "@/../deliberation-empirica/server/src/preFlight/validateTreatmentFile";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

export function EditElement({
  treatment,
  editTreatment,
  stageIndex,
  elementIndex,
}: {
  treatment: TreatmentType;
  editTreatment: Function;
  stageIndex: number;
  elementIndex: number;
}) {

  const [isValid, setIsValid] = useState(true)
  var element = treatment.gameStages[stageIndex].elements[elementIndex];  // if elementIndex is undefine, is the whole thing undefined? or does it error?
   

  const { register, watch } = useForm({
    defaultValues: {
      name: element?.name || "Enter Name",
      type: element?.type || "Pick one",
      file: element?.file || "",
      url: element?.url || "",
      params: element?.params || "",
      style: element?.style || "",
      buttonText: element?.buttonText || "",
      startTime: element?.startTime || "",
      endTime: element?.endTime || "",
    },
    resolver: zodResolver(elementSchema),
  });

  function saveEdits() {
    const updatedTreatment = JSON.parse(JSON.stringify(treatment)); // deep copy
    if (stageIndex === undefined) {
        throw new Error("No stage index given")
    }

    const parseResult = elementSchema.safeParse({
        name: watch("name"),
        type: watch("type"),
        file: watch("file"),
        url: watch("url"),
        params: watch("params"),
        style: watch("style"),
        buttonText: watch("buttonText"),
        startTime: watch("startTime"),
        endTime: watch("endTime")
      })
    if (!parseResult.success) {
    console.log(parseResult.error)
    window.alert( parseResult.error ) 
    setIsValid(false);
    return;
    }
      
    setIsValid(true);
    const newElement = parseResult.data
    if (elementIndex === undefined) { // create new element
    updatedTreatment.gameStages[stageIndex].elements.push(newElement)
    } else {
    updatedTreatment.gameStages[stageIndex].elements[elementIndex] = newElement 
    }
    editTreatment(updatedTreatment);
  }

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

//   function handleSave(saveType: string) {
//     const updatedTreatment = { ...treatment };

//     if (saveType === "addStage") {
//       const inputs = {
//         name: watch("name"),
//         duration: parseInt(watch("duration")),
//         elements: [],
//       };
//       updatedTreatment?.gameStages?.push(inputs);
//     } else if (saveType === "editStage") {
//       const stageElmts = updatedTreatment.gameStages[stageIndex].elements;
//       const inputs = {
//         name: watch("name"),
//         duration: parseInt(watch("duration")),
//         elements: [],
//       };
//       updatedTreatment.gameStages[stageIndex] = inputs;
//       updatedTreatment.gameStages[stageIndex].elements = stageElmts;
//     } else if (saveType === "addElement" || saveType === "editElement") {
//       const inputs: { name: any; type: any; [key: string]: any } = {
//         name: watch("name"),
//         type: watch("selectedOption"),
//       };
//       if (watch("file") !== "") inputs.file = watch("file");
//       if (watch("url") !== "") inputs.url = watch("url");
//       if (watch("params") !== "") inputs.params = watch("params");
//       if (watch("onSubmit") !== "") inputs.onSubmit = watch("onSubmit");
//       if (watch("style") !== "") inputs.style = watch("style");
//       if (watch("buttonText") !== "") inputs.buttonText = watch("buttonText");
//       if (watch("startTime") !== "") inputs.startTime = watch("startTime");
//       if (watch("endTime") !== "") inputs.endTime = watch("endTime");

//       if (saveType === "addElement") {
//         updatedTreatment?.gameStages[stageIndex]?.elements?.push(inputs);
//       } else if (type === "editElement") {
//         updatedTreatment.gameStages[stageIndex].elements[elementIndex] = inputs;
//       }
//     } else if (saveType === "deleteElement") {
//       const oldElements = {
//         ...updatedTreatment.gameStages[stageIndex].elements,
//       };
//       var newElements: any[] = [];
//       Object.keys(oldElements).forEach((key) => {
//         if (key != elementIndex) {
//           newElements.push(oldElements[key]);
//         }
//       });
//       updatedTreatment.gameStages[stageIndex].elements = newElements;
//     } else if (saveType === "deleteStage") {
//       const oldStages = { ...updatedTreatment.gameStages };
//       var newStages: any[] = [];
//       Object.keys(oldStages).forEach((key) => {
//         if (key != stageIndex) {
//           newStages.push(oldStages[key]);
//         }
//       });
//       updatedTreatment.gameStages = newStages;
//     }

//     setTreatment(updatedTreatment);

//     /*
//     const addElementDialog = document.getElementById('add-element');
//     if (addElementDialog) {
//       addElementDialog.close();
//     }
//     */

//     localStorage.setItem("code", stringify(updatedTreatment));
//     window.location.reload();
//   }

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
            data-cy={`edit-element-name-stage${stageIndex}-element${elementIndex || "new"}`}
            placeholder="Enter text here."
            className="input input-bordered w-full max-w-xs"
          />
        </label>
      </div>

      
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Type"}</span>
            </div>
            <select
              {...register("type", { required: true })}
              data-cy={`edit-element-type-stage${stageIndex}-element${elementIndex || "new"}`}
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

      {(watch("type") === "prompt" ||
        watch("type") === "audioElement") && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"File Address"}</span>
            </div>
            <input
              {...register("file", { required: true })}
              data-cy={`edit-element-file-stage${stageIndex}-element${elementIndex || "new"}`}
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
                data-cy={`edit-element-start-time-stage${stageIndex}-element${elementIndex || "new"}`}
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
                data-cy={`edit-element-end-time-stage${stageIndex}-element${elementIndex || "new"}`}
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
              data-cy={`edit-element-url-stage${stageIndex}-element${elementIndex || "new"}`}
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
              data-cy={`edit-element-params-stage${stageIndex}-element${elementIndex || "new"}`}
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
              data-cy={`edit-element-style-stage${stageIndex}-element${elementIndex || "new"}`}
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
              data-cy={`edit-element-button-text-stage${stageIndex}-element${elementIndex || "new"}`}
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
        data-cy={`save-edits-stage-${stageIndex}-element-${elementIndex || "new"}`}
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={saveEdits}
        disabled={!isValid}
      >
        Save
      </button>
      
      {/* Todo: Do we want to hide the delete button when creating a new element? */}
        <button
          data-cy={`delete-element-stage-${stageIndex}-element-${elementIndex || "new"}`}
          className="btn btn-secondary"
          style={{ margin: "10px" }}
          onClick={deleteElement}
        >
          {"Delete"}
        </button>
      
    
    </div>
  );
}
