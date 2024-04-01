import 'react'
import { useState } from 'react'
export default function ({value, setValue, maxValue}) {
    // TODO figure out how to make this stop at the end of the last stage
    // TODO figure out how to account for padding
    // TODO figure out how to get the max value (this is hardcoded)
    return (
        <div>
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