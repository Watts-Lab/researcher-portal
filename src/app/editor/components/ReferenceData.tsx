import React, { FC } from 'react'

interface ReferenceDataProps {
  participantInfoName?: string
  guessPartnerParty?: string
  guessPartnerPosition?: string
  stageName?: string
  setParticipantInfoName: (value: string) => void
  setGuessPartnerParty: (value: string) => void
  setGuessPartnerPosition: (value: string) => void
  setStageName: (value: string) => void
}

const ReferenceData: FC<ReferenceDataProps> = ({
  participantInfoName = '',
  guessPartnerParty = '',
  guessPartnerPosition = '',
  stageName = '',
  setParticipantInfoName,
  setGuessPartnerParty,
  setGuessPartnerPosition,
  setStageName,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Stage Refs and Dependencies
      </h2>

      {/* user input for participantInfo.name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Participant Info - Name
        </label>
        <input
          type="text"
          value={participantInfoName}
          onChange={(e) => setParticipantInfoName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-md hover:shadow-lg focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-200 ease-in-out"
          placeholder="Enter participant name"
        />
      </div>

      {/* user input for prompt.guessPartnerParty */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Prompt - Guess Partner Party
        </label>
        <input
          type="text"
          value={guessPartnerParty}
          onChange={(e) => setGuessPartnerParty(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-md hover:shadow-lg focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-200 ease-in-out"
          placeholder="Enter partner party"
        />
      </div>

      {/* user input for prompt.guessPartnerPosition */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Prompt - Guess Partner Position
        </label>
        <input
          type="text"
          value={guessPartnerPosition}
          onChange={(e) => setGuessPartnerPosition(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-md hover:shadow-lg focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-200 ease-in-out"
          placeholder="Enter partner position"
        />
      </div>

      {/* user input for stageName */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Stage Name
        </label>
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 p-2 shadow-md hover:shadow-lg focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-shadow duration-200 ease-in-out"
          placeholder="Enter stage name"
        />
      </div>
    </div>
  )
}

export default ReferenceData
