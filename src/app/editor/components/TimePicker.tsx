import 'react'
import { useState } from 'react'
export default function ({}) {
    const [value, setValue] = useState("0")
    // TODO figure out how to make this stop at the end of the last stage
    // TODO figure out how to account for padding
    // TODO figure out how to get the max value (this is hardcoded)
    return (
        <div>
            <input className='w-full'
                type="range"
                min="0"
                max="1200"
                defaultValue="0"
                onChange={(e) => (setValue(e.target.value))}
            />
            {value}
        </div>
    )
}