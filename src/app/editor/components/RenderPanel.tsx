import React, { useEffect, useState, useContext } from 'react'
import dynamic from 'next/dynamic.js'
import TimePicker from './TimePicker'
import { Stage } from './../../../.././deliberation-empirica/client/src/Stage.jsx'
import RenderDelibElement from './RenderDelibElement'

import { StageContext } from '../../../.././@empirica-mocks/core/stageContext'

{
  /*const Stage = dynamic(
  () =>
    import('./../../../.././deliberation-empirica/client/src/Stage.jsx').then(
      (mod) => mod.Stage
    ) as any,
  {
    ssr: false,
  }
)*/
}

export function RenderPanel() {
  const [time, setTime] = useState(0)

  const { currentStageIndex, setCurrentStageIndex, elapsed, setElapsed } =
    useContext(StageContext)
  console.log('RenderPanel.tsx current stage index', currentStageIndex)

  // const currentStageIndex = Number(localStorage.getItem('currentStageIndex'))

  //const treatment =
  //const currentStage = treatment?.gameStages.?[currentStageIndex]

  //console.log('Current stage', localStorage.getItem('currentStageIndex'))

  return (
    <div className="flex">
      {currentStageIndex === 'default' && (
        <h1>
          Click on a stage card to preview the stage from a participant view.
        </h1>
      )}
      {currentStageIndex !== 'default' && (
        <div>
          <h1>Preview of stage {currentStageIndex} </h1>
          <TimePicker
            value={time + ' s'}
            setValue={setElapsed}
            maxValue={300}
          />
          {/* need to retrieve stage duration from treatment */}
        </div>
      )}
      {currentStageIndex !== 'default' && (
        <div className="divider divider-horizontal"></div>
      )}
      {/* <div>
        {elements !== undefined &&
          elements.map(
            (element: any, index: any) =>
              ((element.displayTime <= time && element.hideTime >= time) ||
                !element.displayTime) && (
                <div key={index}>
                  {index != 0 && <div className="divider"></div>}
                  <RenderDelibElement element={element} />
                </div>
              )
          )}
      </div> */}

      {/* Currently causes build to fail*/}

      <div className="page-display-container">
        {currentStageIndex !== 'default' ?? <Stage />}
      </div>
    </div>
  )
}
