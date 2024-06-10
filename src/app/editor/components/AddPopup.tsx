import React from "react";
import { useState } from "react";
import { stringify } from "yaml";

export default function AddPopup({type, questions, treatment, setTreatment, stageIndex, elementIndex}: 
  {type:string, questions:any, treatment:any, setTreatment:any, stageIndex:any, elementIndex:any}) {

  function handleSave(saveType : string) {
    const updatedTreatment = {...treatment}
    if (saveType === "addStage"){
      const inputs = {name: nameValue, duration: parseInt(durationValue), elements: []}
      updatedTreatment?.gameStages?.push(inputs)
    } 

    else if (saveType === "editStage"){
      const stageElmts = updatedTreatment.gameStages[stageIndex].elements
      const inputs = {name: nameValue, duration: parseInt(durationValue), elements: []}
      updatedTreatment.gameStages[stageIndex] = inputs
      updatedTreatment.gameStages[stageIndex].elements = stageElmts
    }

    else if (saveType === "addElement" || saveType === "editElement"){
      const inputs: { name: any; type: any; [key: string]: any } = {name: nameValue, type: selectedOption}
      for (const key in elementValues) {
        const value = elementValues[key as keyof typeof elementValues];
        if (value != '') {
          inputs[key as keyof typeof elementValues] = value
        }
      }
      if (saveType === "addElement"){
        updatedTreatment?.gameStages[stageIndex]?.elements?.push(inputs)
      } else if (type === "editElement"){
        updatedTreatment.gameStages[stageIndex].elements[elementIndex] = inputs
      }
    }

    else if (saveType === "deleteElement") {
      const oldElements = {...updatedTreatment.gameStages[stageIndex].elements}
      var newElements : any[] = [];
      Object.keys(oldElements).forEach(key => {
        if (key != elementIndex) {
          newElements.push(oldElements[key]);
        }
      });
      updatedTreatment.gameStages[stageIndex].elements = newElements
    }

    else if (saveType === "deleteStage") {
      const oldStages = {...updatedTreatment.gameStages}
      var newStages : any[] = [];
      Object.keys(oldStages).forEach(key => {
        if (key != stageIndex) {
          newStages.push(oldStages[key]);
        }
      });
      updatedTreatment.gameStages = newStages
    }

    setSelectedOption(null)
    setNameValue('')
    setDurationValue('')
    setElementValues(defaultElementValues)
    setTreatment(updatedTreatment)

    /*
    const addElementDialog = document.getElementById('add-element');
    if (addElementDialog) {
      addElementDialog.close();
    }
    */

    localStorage.setItem("code", stringify(updatedTreatment))
    window.location.reload()
  }
  
  var currComponent;
  if (type === "editElement") {
    currComponent = treatment.gameStages[stageIndex].elements[elementIndex];
  } else if (type === "editStage") {
    currComponent = treatment.gameStages[stageIndex];
  }
    
  const [selectedOption, setSelectedOption] = useState((currComponent !== undefined && currComponent.type !== undefined) ? currComponent.type : "Pick one");
  const [nameValue, setNameValue] = useState((currComponent !== undefined && currComponent.name !== undefined) ? currComponent.name : "");
  const [durationValue, setDurationValue] = useState((currComponent !== undefined && currComponent.duration !== undefined) ? currComponent.duration : "");

  const handleNameChange = (event : any) => {
    setNameValue(event.target.value);
  }

  const handleDurationChange = (event : any) => {
    setDurationValue(event.target.value);
  }

  const handleSelectChange = (event : any) => {
    const selectedValues = event.target.selectedOptions[0].value 
    setSelectedOption(selectedValues);
    setElementValues(defaultElementValues);
  };

  const defaultElementValues = {
    file: '',
    url: '',
    params: '',
    onSubmit: '',
    style: '',
    buttonText: '',
    startTime: '',
    endTime: '',
  };
  const [elementValues, setElementValues] = useState<{
    file: string;
    url: string;
    params: string;
    onSubmit: string;
    style: string;
    buttonText: string;
    startTime: string;
    endTime: string;}
    >(defaultElementValues);

  const handleInputChange = (property : any, newValue: any) => {
    setElementValues((prevValues) => ({
      ...prevValues,
      [property]: newValue,
    }));
  };

  const handleFileChange = (newValue : any) => handleInputChange('file', newValue);
  const handleURLChange = (newValue : any) => handleInputChange('url', newValue);
  const handleParamsChange = (newValue : any) => handleInputChange('params', newValue);
  const handleOnSubmitChange = (newValue : any) => handleInputChange('onSubmit', newValue);
  const handleStyleChange = (newValue : any) => handleInputChange('style', newValue);
  const handleButtonTextChange = (newValue : any) => handleInputChange('buttonText', newValue);
  const handleStartTimeChange = (newValue : any) => handleInputChange('startTime', newValue);
  const handleEndTimeChange = (newValue : any) => handleInputChange('endTime', newValue);
   
  // DEFAULT QUESTIONS
  //console.log(stageIndex)
  stageIndex = stageIndex !== undefined ? stageIndex : ""
  
  elementIndex = elementIndex !== undefined ? elementIndex : ""

  const htmlElements = []
  questions.forEach((q : any, index : any) => {
    const question = q.question
    const responseType = q.responseType
    const options = q.options || []
    htmlElements.push(
      <form key={"defaultq" + index}>
        {question === "Name" &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <input data-cy={"add-popup-name-"+type+"-"+stageIndex+"-"+elementIndex} value = {nameValue} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={handleNameChange}/>
            </label>
          </div>
        }
        {question === "Duration" &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <input data-cy={"add-popup-duration-"+type+"-"+stageIndex+"-"+elementIndex} value = {durationValue} type="text" placeholder="Enter number here." className="input input-bordered w-full max-w-xs" onChange={handleDurationChange}/>
            </label>
          </div>
        }
        {question === "Type" &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <select data-cy={"add-popup-type-"+type+"-"+stageIndex+"-"+elementIndex} className="select select-bordered" multiple={responseType === "multiselect"} onChange={handleSelectChange} defaultValue={selectedOption}> 
                <option disabled>Pick one</option>
                {options.map((option : any, index : any) => (<option key={option + index}>{option}</option>))}
              </select>
            </label>
          </div>
        }
      </form>
    )
  })

  // ELEMENT ATTRIBUTE QUESTIONS
  htmlElements.push(
    <form key={"elementAttributes:" + selectedOption}>
      { (selectedOption === "prompt" || selectedOption === "audioElement") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"File Address"}</span>
            </div>
            <input data-cy={"add-popup-fileAddress-"+type+"-"+stageIndex+"-"+elementIndex} value = {elementValues.file} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleFileChange(e.target.value)}/>
          </label>
        </div>
      }
      { (selectedOption === "kitchenTimer") && 
        <div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{"Start Time"}</span>
              </div>
              <input value = {elementValues.startTime} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleStartTimeChange(e.target.value)}/>
            </label>
          </div>
          <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"End Time"}</span>
            </div>
            <input value = {elementValues.endTime} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleEndTimeChange(e.target.value)}/>
          </label>
        </div>
      </div>
      }
      { (selectedOption === "qualtrics" || selectedOption === "trainingVideo") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"URL"}</span>
            </div>
            <input data-cy={"add-popup-URL-"+type+"-"+stageIndex+"-"+elementIndex} value = {elementValues.url} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleURLChange(e.target.value)}/>
          </label>
        </div>
      }
      { (selectedOption === "qualtrics") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Parameters"}</span>
            </div>
            <input value = {elementValues.params} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleParamsChange(e.target.value)}/>
          </label>
        </div>
      }
      { (selectedOption === "separator") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Style"}</span>
            </div>
            <input value = {elementValues.style} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleStyleChange(e.target.value)}/>
          </label>
        </div>
      }     
      { (selectedOption === "survey" || selectedOption === "qualtrics" || selectedOption === "submitButton") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"On Submit"}</span>
            </div>
            <input data-cy={"add-popup-onSubmit-"+type+"-"+stageIndex+"-"+elementIndex} value = {elementValues.onSubmit} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleOnSubmitChange(e.target.value)}/>
          </label>
        </div>
      }
      { (selectedOption === "submitButton") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"Button Text"}</span>
            </div>
            <input value = {elementValues.buttonText} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleButtonTextChange(e.target.value)}/>
          </label>
        </div>
      }
    </form>
  )

  var header;
  if (type === "editElement"){
    header = "Edit Element"
  } else if (type === "addElement"){
    header = "Add Element"
  } else if (type === "addStage"){
    header = "Add Stage"
  } else if (type === "editStage"){
    header = "Edit Stage"
  }

  return (
    <div>
      <h1>{header}</h1>
      {htmlElements}
      <button data-cy={"add-popup-save-"+type+"-"+stageIndex+"-"+elementIndex} className="btn btn-primary" style={{ margin: '10px' }} onClick={() => handleSave(type)} disabled={(durationValue === "" || nameValue === "") && (selectedOption === "Pick one" || nameValue === "")}>Save</button>
      {type === "editElement" && 
      <button data-cy={"add-popup-delete-"+type+"-"+stageIndex+"-"+elementIndex} className="btn btn-secondary" style={{ margin: '10px' }} onClick={() => handleSave("deleteElement")}>{"Delete"}</button>
      }
      {type === "editStage" && 
      <button data-cy={"add-popup-delete-"+type+"-"+stageIndex+"-"+elementIndex} className="btn btn-secondary" style={{ margin: '10px' }} onClick={() => handleSave("deleteStage")}>{"Delete"}</button>
      }
    </div>
  );
}