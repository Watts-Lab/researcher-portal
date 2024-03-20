import React from "react";
import { useState } from "react";
import { stringify } from "yaml";

export default function AddPopup({type, questions, treatment, setTreatment, stageIndex, elementIndex}) {

  function handleSave(saveType) {
    const updatedTreatment = {...treatment}

    if (saveType === "addStage"){
      const inputs = {name: nameValue, duration: parseInt(durationValue), elements: []}
      updatedTreatment?.gameStages?.push(inputs)
    } 

    else if (saveType === "addElement" || saveType === "editElement"){
      const inputs = {name: nameValue, type: selectedOption}
      for (const key in elementValues) {
        const value = elementValues[key];
        if (value != '') {
          inputs[key] = value
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
      var newElements = [];
      Object.keys(oldElements).forEach(key => {
        if (key != elementIndex) {
          newElements.push(oldElements[key]);
        }
      });
      updatedTreatment.gameStages[stageIndex].elements = newElements
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
    window.location.reload(false)
  }
  
  var currElement;
  if (type === "editElement") {
    currElement = treatment.gameStages[stageIndex].elements[elementIndex];
  }
    
  const [selectedOption, setSelectedOption] = useState(currElement !== undefined && currElement.type !== undefined ? currElement.type : "Pick one");
  const [nameValue, setNameValue] = useState(currElement !== undefined && currElement.name !== undefined ? currElement.name : "");
  const [durationValue, setDurationValue] = useState('');

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  }

  const handleDurationChange = (event) => {
    setDurationValue(event.target.value);
  }

  const handleSelectChange = (event) => {
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
   
  // DEFAULT QUESTIONS
  const htmlElements = []
  questions.forEach((q, index) => {
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
              <input value = {nameValue} type="text" placeholder="Enter text here." className="input input-bordered w-full max-w-xs" onChange={handleNameChange}/>
            </label>
          </div>
        }
        {question === "Duration" &&
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{question}</span>
              </div>
              <input value = {durationValue} type="text" placeholder="Enter number here." className="input input-bordered w-full max-w-xs" onChange={handleDurationChange}/>
            </label>
          </div>
        }
        {question === "Type" &&
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

  // ELEMENT ATTRIBUTE QUESTIONS
  htmlElements.push(
    <form key={"elementAttributes:" + selectedOption}>
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

  var header;
  if (type === "editElement"){
    header = "Edit Element"
  } else if (type === "addElement"){
    header = "Add Element"
  } else if (type === "addStage"){
    header = "Add Stage"
  }

  return (
    <div>
      <h1>{header}</h1>
      {htmlElements}
      <button className="btn btn-primary" style={{ margin: '10px' }} onClick={() => handleSave(type)} disabled={(durationValue === '' || nameValue === '') && (selectedOption == null || nameValue === '')}>Save</button>
      {type === "editElement" && 
      <button className="btn btn-secondary" style={{ margin: '10px' }} onClick={() => handleSave("deleteElement")}>{"Delete"}</button>
      }
    </div>
  );
}