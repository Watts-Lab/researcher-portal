import React from "react";

export default function AddPopup({ questions, type, treatment, setTreatment }) {
   //questions will be a list of dicts in form [{question: question, responseType: text, dropdown, or multiselect, options: options that will appear if dropdown or multiselect}]
  //  questions = [
  //    {"question": "Name", "responseType": "text"},
  //    {"question": "Type", "responseType": "dropdown", "options": ["Prompt", "Survey"]},
  //   //  {"question": "File", "responseType": "multiselect", "options": ["Prompt", "Survey"]},
  //  ]

  function handleSave() {
    console.log("local storgae code: ", localStorage.getItem("code"))
    treatment?.gameStages?.push({"name": "new stage", "duration": 90}) //TODO not hardcode this - it does add to treatment
    console.log(treatment.gameStages)
    localStorage.setItem("code", JSON.stringify(treatment))
    window.location.reload(false) //force refresh
  }
   
  const htmlElements = []
  questions.forEach(q => {
    const question = q.question
    const responseType = q.responseType
    const options = q.options || []
    console.log(responseType)
    htmlElements.push(
      <form>
        {responseType === "text" &&
          <div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">{question}</span>
              </div>
              <input type="text" placeholder="Enter text here." class="input input-bordered w-full max-w-xs" />
            </label>
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
      </form>
    )

   })

  return (
    <div>
      <h1> Add {type}</h1>
      {htmlElements}
      <button className="btn btn-primary" onClick={handleSave}>Add Stage</button>
    </div>
  );
}