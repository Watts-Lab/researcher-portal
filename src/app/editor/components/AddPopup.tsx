import React from "react";
import { useState } from "react";
import { stringify } from "yaml";

export default function AddPopup({ questions, type, treatment, setTreatment }) {
   //questions will be a list of dicts in form [{question: question, responseType: text, dropdown, or multiselect, options: options that will appear if dropdown or multiselect}]
  //  questions = [
  //    {"question": "Name", "responseType": "text"},
  //    {"question": "Type", "responseType": "dropdown", "options": ["Prompt", "Survey"]},
  //   //  {"question": "File", "responseType": "multiselect", "options": ["Prompt", "Survey"]},
  //  ]

  function handleSave() {
    const updatedTreatment = {...treatment}
    const inputs = {name: nameValue, duration: parseInt(durationValue), elements: []}

    console.log(inputs)

    updatedTreatment[0].gameStages.push(inputs)
    setTreatment(updatedTreatment)
    console.log(updatedTreatment)
    localStorage.setItem("code", stringify(updatedTreatment))

    setNameValue('')
    setDurationValue('')

    window.location.reload(false)
  }

  const [nameValue, setNameValue] = useState('');
  const [durationValue, setDurationValue] = useState('');

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  }

  const handleDurationChange = (event) => {
    setDurationValue(event.target.value);
  }
   
  const htmlElements = []
  questions.forEach(q => {
    const question = q.question
    const responseType = q.responseType
    const options = q.options || []
    //console.log(responseType)
    htmlElements.push(
      <form>
        {question === "Name" &&
          <div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">{question}</span>
              </div>
              <input value = {nameValue} type="text" placeholder="Enter text here." class="input input-bordered w-full max-w-xs" onChange={handleNameChange}/>
            </label>
          </div>
        }
        {question === "Duration" &&
          <div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">{question}</span>
              </div>
              <input value = {durationValue} type="text" placeholder="Enter number here." class="input input-bordered w-full max-w-xs" onChange={handleDurationChange}/>
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
      <button className="btn btn-primary" style={{ margin: '10px' }} onClick={handleSave} disabled={durationValue === '' || nameValue === ''}>Add Stage</button>
    </div>
  );
}