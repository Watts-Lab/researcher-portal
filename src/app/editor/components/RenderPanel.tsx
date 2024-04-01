import React, {useEffect, useState} from "react";
import TimePicker from "./TimePicker";
import { Element } from "./Element";
export function RenderPanel({setRenderElements, renderElements, stageDuration}) {
    const [time, setTime] = useState(0)

    return(
        <div>
            <h1>Render Panel </h1>
            {renderElements !== undefined && renderElements.map((element, index) => (
                ((element.displayTime <= time && element.hideTime >= time) || !element.displayTime) &&
                <Element element={element} />
            ))
            }
            <TimePicker value = {time} setValue={setTime} maxValue={stageDuration}/>
        </div>
    )
}