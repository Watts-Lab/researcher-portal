import React from "react";
import { useState } from "react";

export default function AddElementPopup({ questions, type, treatment, setTreatment }) {
   //questions will be a list of dicts in form [{question: question, responseType: text, dropdown, or multiselect, options: options that will appear if dropdown or multiselect}]
  //  questions = [
  //    {"question": "Name", "responseType": "text"},
  //    {"question": "Type", "responseType": "dropdown", "options": ["Prompt", "Survey"]},
  //   //  {"question": "File", "responseType": "multiselect", "options": ["Prompt", "Survey"]},
  //  ]

  function handleSave() {
    const updatedTreatment = {...treatment}
    updatedTreatment.gameStages[0].elements?.push({"type": selectedOption, "name" : nameValue})
    setTreatment(updatedTreatment)
    console.log("UPDATED TREATMENT")
    console.log(updatedTreatment.gameStages[0])
  }

  const [selectedOption, setSelectedOption] = useState(null);
  const [nameValue, setNameValue] = useState('');

  const handleSelectChange = (event) => {
    const selectedValues = event.target.selectedOptions[0].value 
    setSelectedOption(selectedValues);
  };

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  }
  
  const htmlElements = []
  questions.forEach(q => {
    const question = q.question
    const responseType = q.responseType
    const options = q.options || []
    //console.log(responseType)
    htmlElements.push(
      <form>
        {responseType === "text" &&
          <div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">{question}</span>
              </div>
              <input value = {nameValue} type="text" placeholder="Enter text here." class="input input-bordered w-full max-w-xs" onChange={handleNameChange}/>
            </label>
          </div>
        }
        {(responseType === "dropdown" || responseType === "multiselect") &&
          <div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">{question}</span>
              </div>
              <select class="select select-bordered" multiple={responseType === "multiselect"} onChange={handleSelectChange}> //TODO fix multiselect
                <option disabled selected>Pick one</option>
                {options.map(option => (<option>{option}</option>))}
              </select>
            </label>
          </div>
        }
      </form>
    )

   })

  return (
    <div>
      <h1> Add {type}</h1>
      {htmlElements}
      <button className="btn btn-primary" onClick={handleSave}>Add Element</button>
    </div>
  );
}