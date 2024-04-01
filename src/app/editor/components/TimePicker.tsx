import 'react'
import { useState } from 'react'
export default function ({value, setValue, maxValue}) {
    return (
        <div>
            <h3>Select a time in seconds:</h3>
            <input className=''
                type="range"
                min="0"
                max={maxValue}
                defaultValue="0"
                onChange={(e) => (setValue(e.target.value))}
            />
            {value}
        </div>
    )
}