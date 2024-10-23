import React, { useEffect, useState } from 'react'

// helper to format references
const formatReference = (reference: string) => {
  return reference
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(': ')
}

// helper to get part after  last colon just for placeholdera
const getPlaceholderText = (reference: string) => {
  const parts = reference.split(':')
  return parts.length > 1 ? parts[parts.length - 1].trim() : reference
}

// find 'references' in the treatment object by stage (recursively..hopefully runtime not too bad)
const findReferencesByStage = (obj: any): any[] => {
  let references: any[] = []

  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (key === 'reference') {
        references.push(obj[key])
      } else if (typeof obj[key] === 'object') {
        references = references.concat(findReferencesByStage(obj[key]))
      }
    }
  }

  return references
}

// Pre-initialize JSON structure with empty strings for references
const initializeJsonData = (treatment: any) => {
  const jsonData: { [key: string]: any } = {}
  treatment?.gameStages?.forEach((stage: any, index: number) => {
    const references = findReferencesByStage(stage)
    jsonData[`stage_${index}`] = {}
    references.forEach((reference) => {
      jsonData[`stage_${index}`][reference] = ''
    })
  })
  return jsonData
}

interface Treatment {
  gameStages: any[]
}

interface ReferenceDataProps {
  treatment: Treatment
  stageIndex: number
}

interface JsonData {
  [key: string]: {
    [reference: string]: string
  }
}

interface InputValues {
  [key: string]: {
    [reference: string]: string
  }
}

const ReferenceData = ({ treatment, stageIndex }: ReferenceDataProps) => {
  const [references, setReferences] = useState<string[]>([])
  const [jsonData, setJsonData] = useState<JsonData>({})
  const [inputValues, setInputValues] = useState<InputValues>({})

 // Load references for the selected stage
 useEffect(() => {
  if (treatment?.gameStages?.[stageIndex]) {
    const stage = treatment.gameStages[stageIndex];
    const allReferences = findReferencesByStage(stage);
    setReferences(allReferences);

    // Load or initialize JSON data for the current stage
    if (!jsonData[`stage_${stageIndex}`]) {
      const initializedJson = initializeJsonData(treatment);
      setJsonData((prev) => ({ ...prev, ...initializedJson }));
    }

    // Load or keep input values from state/localStorage without overwriting
    if (!inputValues[`stage_${stageIndex}`]) {
      const savedInputValues = JSON.parse(localStorage.getItem('inputValues') || '{}');
      const initialValues = savedInputValues[`stage_${stageIndex}`] || {};

      setInputValues((prev) => ({
        ...prev,
        [`stage_${stageIndex}`]: initialValues,
      }));
    }
  }
}, [treatment, stageIndex, jsonData, inputValues, setJsonData, setInputValues]);


  // Handle input change and update state for the current stage
  const handleInputChange = (reference: string, value: string) => {
    setInputValues((prev: { [key: string]: any }) => ({
      ...prev,
      [`stage_${stageIndex}`]: {
        ...(prev[`stage_${stageIndex}`] || {}),
        [reference]: value,
      },
    }))
  }

  // Save the current input values to the JSON structure and localStorage
  const saveAsJson = () => {
    const updatedJson = {
      ...jsonData,
      [`stage_${stageIndex}`]: inputValues[`stage_${stageIndex}`],
    }
    setJsonData(updatedJson) // Update state
    localStorage.setItem('jsonData', JSON.stringify(updatedJson)) // Save to localStorage

    console.log('Saved JSON Data:', JSON.stringify(updatedJson, null, 2)) // Pretty print
  }

  useEffect(() => {
    const savedJson = localStorage.getItem('jsonData')
    const savedInputValues = localStorage.getItem('inputValues')

    if (savedJson) {
      console.log('Loaded JSON Data from localStorage:', JSON.parse(savedJson))
      setJsonData(JSON.parse(savedJson))
    }

    if (savedInputValues) {
      console.log(
        'Loaded Input Values from localStorage:',
        JSON.parse(savedInputValues)
      )
      setInputValues(JSON.parse(savedInputValues))
    }
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Stage Refs and Dependencies
      </h2>

      {references.map((reference, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {formatReference(reference)}
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-md hover:shadow-lg focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-200 ease-in-out"
            placeholder={`Enter value for ${getPlaceholderText(
              formatReference(reference)
            )}`}
            value={inputValues[`stage_${stageIndex}`]?.[reference] || ''}
            onChange={(e) => handleInputChange(reference, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={saveAsJson}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  )
}

export default ReferenceData

// const yamlString = `
//   name: ManipulationCheck
//   elements:
//     - type: prompt
//       file: projects/css_lab/ct_topic/consider_partner.md

//     - type: display
//       reference: participantInfo.name
//       position: 0
//       showToPositions: [1]

//     - type: display
//       reference: participantInfo.MEOW
//       position: 1
//       showToPositions: [0]

//     - type: prompt
//       file: projects/css_lab/ct_topic/guess_partner_party.md
//       name: guessPartnerParty
//       tags: ["outcome"]

//     - type: prompt
//       file: projects/css_lab/ct_topic/guess_partner_position.md

//     - type: prompt
//       file: "shared/yesNo/\${topicName}_survey.md"
//       name: guessPartnerPosition
//       tags: ["outcome"]

//     - type: submitButton
//       conditions:
//         - reference: prompt.guessPartnerParty
//           comparator: exists
//         - reference: prompt.guessPartnerPosition
//           comparator: exists
