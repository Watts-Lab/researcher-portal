import React, { useEffect, useState } from 'react'

// helper to format references
const formatReference = (reference: string) => {
  return reference
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(': ')
}

// helper to get part after  last colon just for placeholder
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
const initializeJsonData = (
  treatment: any
): { [stage: string]: { [ref: string]: string } } => {
  const jsonData: { [stage: string]: { [ref: string]: string } } = {}

  treatment?.gameStages?.forEach((stage: any, index: number) => {
    const references = findReferencesByStage(stage)
    jsonData[`stage_${index}`] = {}

    // Initialize each reference with an empty string
    references.forEach((reference: string) => {
      jsonData[`stage_${index}`][reference] = ''
    })
  })

  return jsonData
}

const ReferenceData: React.FC<{ treatment: any; stageIndex: number }> = ({
  treatment,
  stageIndex,
}) => {
  const [references, setReferences] = useState<string[]>([])
  const [jsonData, setJsonData] = useState<{
    [stage: string]: { [ref: string]: string }
  }>({})
  const [inputValues, setInputValues] = useState<{
    [stage: string]: { [ref: string]: string }
  }>({})

  //storing it here for now until we have a way to retrieve it from the stage
  useEffect(() => {
    if (treatment && treatment.gameStages && treatment.gameStages[stageIndex]) {
      // we get the specific stage by its stageIndex
      const stage = treatment.gameStages[stageIndex]
      const allReferences = findReferencesByStage(stage)
      setReferences(allReferences)

      // Pre-initialize the JSON structure only on the first load
      if (Object.keys(jsonData).length === 0) {
        const initializedJson = initializeJsonData(treatment)
        setJsonData(initializedJson)
      }

      // Initialize input values for the current stage if not already initialized
      if (!inputValues[`stage_${stageIndex}`]) {
        setInputValues((prev) => ({
          ...prev,
          [`stage_${stageIndex}`]: jsonData[`stage_${stageIndex}`] || {},
        }))
      }
    }
  }, [treatment, stageIndex, jsonData, inputValues])

  // Handle input change and update state for the current stage
  const handleInputChange = (reference: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [`stage_${stageIndex}`]: {
        ...(prev[`stage_${stageIndex}`] || {}),
        [reference]: value,
      },
    }))
  }

  // Save function that updates the JSON array by stage and reference
  const saveAsJson = () => {
    const updatedJson = { ...jsonData }

    // Update only the references for this stage
    updatedJson[`stage_${stageIndex}`] = {
      ...inputValues[`stage_${stageIndex}`],
    }

    setJsonData(updatedJson) // Update state with the new JSON structure
    console.log('Updated JSON:', JSON.stringify(updatedJson, null, 2)) // Pretty print JSON
  }

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
