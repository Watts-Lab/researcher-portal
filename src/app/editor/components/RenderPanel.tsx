import React, { useEffect, useState, createContext, useContext } from 'react'
import dynamic from 'next/dynamic.js'
import TimePicker from './TimePicker'
import ReferenceData from './ReferenceData'
//import { Stage } from './../../../.././deliberation-empirica/client/src/Stage.jsx'
import RenderDelibElement from './RenderDelibElement'

import './../../styles/index.css'
import './../../styles/player-classic-react.css'
import './../../styles/player-classic.css'
import './../../styles/player.css'

import { StageContext } from '@/editor/stageContext'
import { Substitute } from 'styled-components/dist/types'

const StyleContext = createContext({})
const useStyle = () => useContext(StyleContext)

const Stage = dynamic(
  () =>
    import('./../../../.././deliberation-empirica/client/src/Stage.jsx').then(
      (mod) => mod.Stage
    ) as any,
  {
    ssr: false,
  }
)

const StyledStage = () => {
  return (
    <div className="min-w-sm mx-auto aspect-video relative w-full">
      <Stage />
    </div>
  )
}

export function RenderPanel() {
  const [time, setTime] = useState(0)

  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    player,
    templatesMap,
    setTemplatesMap,
    selectedTreatmentIndex,
    setSelectedTreatmentIndex,
  } = useContext(StageContext)

  console.log('RenderPanel.tsx current stage index', currentStageIndex)
  console.log('Current Treatment', treatment)
  console.log('Stage Context', StageContext)
  console.log('player stage', player.stage)

  // const currentStageIndex = Number(localStorage.getItem('currentStageIndex'))

  //const treatment =
  //const currentStage = treatment?.gameStages.?[currentStageIndex]

  //console.log('Current stage', localStorage.getItem('currentStageIndex'))

  useEffect(() => {
    // Updates value of timeline slider when elapsed time changes
    console.log('Elapsed time changed:', elapsed)
    setTime(elapsed)
  }, [elapsed])

  return (
    <div className="flex" data-cy="render-panel">
      {currentStageIndex === 'default' && (
        <h1>
          Click on a stage card to preview the stage from a participant view.
        </h1>
      )}
      {currentStageIndex !== 'default' && (
        <div className="min-w-fit" data-cy="stage-tools">
          <h1>Preview of Stage {currentStageIndex} </h1>
          <TimePicker
            value={time + ' s'}
            setValue={setElapsed}
            maxValue={
              treatment.treatments?.[selectedTreatmentIndex].gameStages[
                currentStageIndex
              ]?.duration ?? 0
            }
          />
          <ReferenceData
            treatment={treatment.treatments?.[selectedTreatmentIndex]}
            stageIndex={currentStageIndex}
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

      <div className="w-full flex">
        {currentStageIndex !== 'default' && <StyledStage />}
      </div>
    </div>
  )
}
