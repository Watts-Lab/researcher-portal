import React from "react";
import { useState } from "react";
import { stringify } from "yaml";

export default function EditElementPopup({ questions, type, treatment, setTreatment, stageIndex, elementIndex }) {

  function handleSave() {
    const updatedTreatment = {...treatment}
    const inputs = {name: nameValue, type: selectedOption}
    for (const key in elementValues) {
      const value = elementValues[key];
      if (value != '') {
        inputs[key] = value
      }
    }
    updatedTreatment.gameStages[stageIndex].elements[elementIndex] = inputs // HARDCODED TO FIRST GAME STAGE

    setSelectedOption(null)
    setNameValue('')
    setElementValues(defaultElementValues)
    setTreatment(updatedTreatment)

    /*
    const addElementDialog = document.getElementById('add-element');
    if (addElementDialog) {
      addElementDialog.close();
    }
    */

    localStorage.setItem("code", stringify(updatedTreatment))
    window.location.reload(false)
  }

  function handleDelete() {
    const updatedTreatment = {...treatment}
    const oldElements = {...updatedTreatment.gameStages[stageIndex].elements}

    const newElements = [];
    Object.keys(oldElements).forEach(key => {
      if (key != elementIndex) {
        newElements.push(oldElements[key]);
      }
    });

    updatedTreatment.gameStages[stageIndex].elements = newElements

    setSelectedOption(null)
    setNameValue('')
    setElementValues(defaultElementValues)
    setTreatment(updatedTreatment)

    /*
    const addElementDialog = document.getElementById('add-element');
    if (addElementDialog) {
      addElementDialog.close();
    }
    */

    localStorage.setItem("code", stringify(updatedTreatment))
    window.location.reload(false)
  }

  const currElement = treatment.gameStages[stageIndex].elements[elementIndex];
  const [selectedOption, setSelectedOption] = useState(currElement !== undefined && currElement.type !== undefined ? currElement.type : null);
  const [nameValue, setNameValue] = useState(currElement !== undefined && currElement.name !== undefined ? currElement.name : "");

  /*console.log("STAGE " + stageIndex + " ELEMENT " + elementIndex);
  console.log("SELECTED OPTION:  " + selectedOption);
  console.log("NAMEVALUE:  " + nameValue);*/

  const handleSelectChange = (event) => {
    const selectedValues = event.target.selectedOptions[0].value 
    setSelectedOption(selectedValues);
    setElementValues(defaultElementValues);
  };

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  }
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
  const [elementValues, setElementValues] = useState(defaultElementValues);

  const handleInputChange = (property, newValue) => {
    setElementValues((prevValues) => ({
      ...prevValues,
      [property]: newValue,
    }));
  };

  const handleFileChange = (newValue) => handleInputChange('file', newValue);
  const handleURLChange = (newValue) => handleInputChange('url', newValue);
  const handleParamsChange = (newValue) => handleInputChange('params', newValue);
  const handleOnSubmitChange = (newValue) => handleInputChange('onSubmit', newValue);
  const handleStyleChange = (newValue) => handleInputChange('style', newValue);
  const handleButtonTextChange = (newValue) => handleInputChange('buttonText', newValue);
  const handleStartTimeChange = (newValue) => handleInputChange('startTime', newValue);
  const handleEndTimeChange = (newValue) => handleInputChange('endTime', newValue);
  
  const htmlElements = []
  questions.forEach((q, index) => {
    const question = q.question
    const responseType = q.responseType
    const options = q.options || []
    htmlElements.push(
      <form key={stageIndex + elementIndex + index}>
        {responseType === "text" &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <input value = {nameValue} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={handleNameChange}/>
            </label>
          </div>
        }
        {(responseType === "dropdown" || responseType === "multiselect") &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <select className="select select-bordered" multiple={responseType === "multiselect"} onChange={handleSelectChange} defaultValue={selectedOption}> //TODO fix multiselect
                <option disabled>Pick one</option>
                {options.map((option, index) => (<option key={option + index}>{option}</option>))}
              </select>
            </label>
          </div>
        }
      </form>
    )
   })

   // ELEMENT ATTRIBUTES
  htmlElements.push(
    <form key={"type" + selectedOption}>
      { (selectedOption === "prompt" || selectedOption === "audioElement") &&
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{"File Address"}</span>
            </div>
            <input value = {elementValues.file} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleFileChange(e.target.value)}/>
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
            <input value = {elementValues.url} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleURLChange(e.target.value)}/>
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
            <input value = {elementValues.onSubmit} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={(e) => handleOnSubmitChange(e.target.value)}/>
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

  return (
    <div>
      <h1> Edit {type}</h1>
      {htmlElements}
      <button className="btn btn-primary" style={{ margin: '10px' }} onClick={handleSave} disabled={selectedOption == null || nameValue === ''}>{"Save Element"}</button>
      <button className="btn btn-secondary" style={{ margin: '10px' }} onClick={handleDelete}>{"Delete"}</button>
    </div>
  );
}