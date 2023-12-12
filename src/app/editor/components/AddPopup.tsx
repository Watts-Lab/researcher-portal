import React from "react";

export default function AddPopup({ questions, type }) {
   //questions will be a list of dicts in form [{question: question, responseType: text, dropdown, or multiselect, options: options that will appear if dropdown or multiselect}]
   questions = [
     {"question": "Name", "responseType": "text"},
     {"question": "Type", "responseType": "dropdown", "options": ["Prompt", "Survey"]},
     {"question": "File", "responseType": "multiselect", "options": ["Prompt", "Survey"]},
   ]
   
   const htmlElements = []
   questions.forEach(q => {
     const question = q.question
     const responseType = q.responseType
     const options = q.options || []
     console.log(responseType)
     htmlElements.push(
       <div>
         {responseType === "text" &&
            <div>
            <h2>{question}</h2>
            <textarea placeholder="Enter text here." class="textarea textarea-bordered textarea-xs w-full max-w-xs" ></textarea>
            </div>
         }
         {(responseType === "dropdown" || responseType === "multiselect") &&
            <div>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">{question}</span>
                </div>
                <select class="select select-bordered" multiple={responseType === "multiselect"}> //TODO fix multiselect
                  <option disabled selected>Pick one</option>
                  {options.map(option => (<option>{option}</option>))}
                </select>
              </label>
            </div>
         }
       </div>
     )

   })

  return (
    <div>
      <h1> Add {type}</h1>
      {htmlElements}
    </div>
  );
}