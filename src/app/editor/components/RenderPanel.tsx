import React, {useEffect, useState} from "react";
import TimePicker from "./TimePicker";
import {Element} from "./../../../.././deliberation-empirica/client/src/elements/Element.jsx";
import RenderDelibElement from "./RenderDelibElement";
export function RenderPanel({renderPanelStage}) {
    const [time, setTime] = useState(0)
    const elements = renderPanelStage.elements
    const stageName = renderPanelStage.title
    const stageDuration = renderPanelStage.duration

    return(
        <div className="flex">
            {!stageName &&
                <h1>Click on a stage card to preview the stage from a participant view.</h1>
            }
            {stageName && 
                <div>
                    <h1>Preview of {stageName} </h1>
                    <TimePicker value = {time + " s"} setValue={setTime} maxValue={stageDuration}/>
                </div>
            }
            {stageName && <div className="divider divider-horizontal"></div>}
            <div>
                {elements !== undefined && elements.map((element, index) => (
                    ((element.displayTime <= time && element.hideTime >= time) || !element.displayTime) &&
                    <div>
                        {index != 0 && <div className="divider"></div>}
                        <RenderDelibElement element={element} onSubmit={() => {}} />
                    </div>
                ))
                }
            </div>
            
        </div>
    )
}