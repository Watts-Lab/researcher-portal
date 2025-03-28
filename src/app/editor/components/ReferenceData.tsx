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

// initializing json data for each stage
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

  // load refs for curr stage
  useEffect(() => {
    if (treatment?.gameStages?.[stageIndex]) {
      const stage = treatment.gameStages[stageIndex]
      const allReferences = findReferencesByStage(stage)
      setReferences(allReferences)

      // load json data for curr stage
      if (!jsonData[`stage_${stageIndex}`]) {
        const initializedJson = initializeJsonData(treatment)
        setJsonData((prev) => ({ ...prev, ...initializedJson }))
      }

      // load input vals from state/localStorage w/o overwriting
      if (!inputValues[`stage_${stageIndex}`]) {
        const savedInputValues = JSON.parse(
          localStorage.getItem('inputValues') || '{}'
        )
        const initialValues = savedInputValues[`stage_${stageIndex}`] || {}

        setInputValues((prev) => ({
          ...prev,
          [`stage_${stageIndex}`]: initialValues,
        }))
      }
    }
  }, [
    treatment,
    stageIndex,
    jsonData,
    inputValues,
    setJsonData,
    setInputValues,
  ])

  // input changa & update state for curr stage
  const handleInputChange = (reference: string, value: string) => {
    setInputValues((prev: { [key: string]: any }) => ({
      ...prev,
      [`stage_${stageIndex}`]: {
        ...(prev[`stage_${stageIndex}`] || {}),
        [reference]: value,
      },
    }))
  }

  // saving curr input values to JSON & localStorage
  const saveAsJson = () => {
    const updatedJson = {
      ...jsonData,
      [`stage_${stageIndex}`]: inputValues[`stage_${stageIndex}`],
    }
    setJsonData(updatedJson)
    localStorage.setItem('jsonData', JSON.stringify(updatedJson))
    console.log('Saved JSON Data:', JSON.stringify(updatedJson, null, 2))
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
      <h2 className="text-lg font-semibold mb-4" data-cy="stagerefs-title">
        Stage Refs and Dependencies
      </h2>

      {references.length > 0 ? (
        <>
          {references.map((reference, index) => {
            const savedValue =
              jsonData[`stage_${stageIndex}`]?.[reference] || ''
            const inputValue =
              inputValues[`stage_${stageIndex}`]?.[reference] || ''

            return (
              <div key={index} className="mb-6">
                <label
                  className="block text-sm font-medium text-gray-700"
                  data-cy={`reference-label-${reference}`}
                >
                  {formatReference(reference)}
                </label>

                {/* saved val */}
                {savedValue && (
                  <p
                    className="text-sm text-gray-500 mt-1"
                    data-cy={`reference-display-${reference}`}
                  >
                    <strong>Saved Value:</strong> {savedValue}
                  </p>
                )}

                {/* input val */}
                <input
                  type="text"
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  data-cy={`reference-input-${reference}`}
                  placeholder={`Enter value for ${getPlaceholderText(
                    formatReference(reference)
                  )}`}
                  value={inputValue}
                  onChange={(e) => handleInputChange(reference, e.target.value)}
                />
              </div>
            )
          })}

          <button
            onClick={saveAsJson}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            data-cy="save-button"
          >
            Save
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500" data-cy="no-references-message">
          No references found
        </p>
      )}
    </div>
  )
}

export default ReferenceData
