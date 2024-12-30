import React from 'react'

interface DropdownProps {
  label: string
  options: string[]
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  dataCy: string
}

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  dataCy,
}: DropdownProps) => {
  return (
    <div data-cy={dataCy} className="flex items-center space-x-2">
      <label className="text-gray font-medium">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="select select-bordered bg-white text-gray-700 font-medium h-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate max-w-xs"
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={typeof value === 'number' ? index : option}
            className="truncate"
          >
            {typeof value === 'number'
              ? option
              : option === 'all'
              ? 'All Stages'
              : option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
