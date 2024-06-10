import 'react'
import { useState } from 'react'
export default function TimePicker({value, setValue, maxValue} : {value: any, setValue: any, maxValue: any}) {
    return (
        <div>
            <h3>Select a time:</h3>
            <input className='range'
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