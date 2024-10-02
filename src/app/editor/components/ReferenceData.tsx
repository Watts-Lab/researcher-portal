import React, { useEffect, useState } from 'react'
import yaml from 'js-yaml'

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

// find all 'references' in the YAML structure (recursively..hopefully runtime not too bad)
const findAllReferences = (obj: any): any[] => {
  let references: any[] = []

  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (key === 'reference') {
        references.push(obj[key])
      } else if (typeof obj[key] === 'object') {
        references = references.concat(findAllReferences(obj[key]))
      }
    }
  }

  return references
}

const ReferenceData: React.FC = () => {
  const [references, setReferences] = useState<string[]>([])

  //storing it here for now until we have a way to retrieve it from the stage
  useEffect(() => {
    const yamlString = `
      name: ManipulationCheck
      elements:
        - type: prompt
          file: projects/css_lab/ct_topic/consider_partner.md

        - type: display
          reference: participantInfo.name
          position: 0
          showToPositions: [1]

        - type: display
          reference: participantInfo.testing!!
          position: 1
          showToPositions: [0]

        - type: prompt
          file: projects/css_lab/ct_topic/guess_partner_party.md
          name: guessPartnerParty
          tags: ["outcome"]

        - type: prompt
          file: projects/css_lab/ct_topic/guess_partner_position.md

        - type: prompt
          file: "shared/yesNo/\${topicName}_survey.md"
          name: guessPartnerPosition
          tags: ["outcome"]

        - type: submitButton
          conditions:
            - reference: prompt.wowCustomPromptHere
              comparator: exists
            - reference: prompt.guessPartnerAge
              comparator: exists
    `

    // parsing YAML into JS object
    const parsedData = yaml.load(yamlString)

    // find all references in parsed YAML structure
    const allReferences = findAllReferences(parsedData)
    setReferences(allReferences)
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
          />
        </div>
      ))}
    </div>
  )
}

export default ReferenceData
