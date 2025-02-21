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
import { TimerContext, TimerProvider } from '@/editor/timerContext'
import { Substitute } from 'styled-components/dist/types'

const StyleContext = createContext({})

const Stage = dynamic(
  () =>
    import('./../../../.././deliberation-empirica/client/src/Stage.jsx').then(
      (mod) => mod.Stage
    ) as any,
  {
    ssr: false,
  }
)

const MemoizedStageContainer = React.memo(() => (
  <div className="min-w-sm mx-auto aspect-video relative w-full">
    <Stage />
  </div>
))
MemoizedStageContainer.displayName = 'MemoizedStageContainer'


const TimerControls = React.memo(() => {
  const { elapsed, setElapsed } = useContext(TimerContext);
  const { currentStageIndex, treatment, selectedTreatmentIndex } = useContext(StageContext);

  // Derive maxValue from the stage configuration if available.
  const maxValue = treatment?.treatments?.[selectedTreatmentIndex]?.gameStages?.[currentStageIndex]?.duration ?? 0;

  return (
    <div className="min-w-fit">
      <h1>Preview of Stage {currentStageIndex}</h1>
      <TimePicker
        value={`${elapsed} s`}
        setValue={setElapsed}
        maxValue={maxValue}
      />
      <ReferenceData
        treatment={treatment?.treatments?.[selectedTreatmentIndex]}
        stageIndex={currentStageIndex}
      />
    </div>
  );
})
TimerControls.displayName = 'TimerControls'

interface RenderPanelProps {
  renderOnly: 'timer' | 'stage' | string;
}

export function RenderPanel({ renderOnly }: RenderPanelProps) {
  const {
    currentStageIndex,
    setCurrentStageIndex,
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

  if (currentStageIndex === 'default') {
    return (
      <div className="flex" data-cy="render-panel">
        <h1>Click on a stage card to preview the stage from a participant view.</h1>
      </div>
    )
  }

  if (renderOnly === 'timer') {
    return <TimerControls />;
  }

  if (renderOnly === 'stage') {
    return (
      <div className="w-full flex">
        <MemoizedStageContainer />
      </div>
    );
  }

  return (
    <div className="flex" data-cy="render-panel">
      {currentStageIndex === 'default' && (
        <h1>
          Click on a stage card to preview the stage from a participant view.
        </h1>
      )}
      {currentStageIndex !== 'default' && (
        <div className="min-w-fit">
          <h1>Preview of Stage {currentStageIndex} </h1>
          <TimerControls/>
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
        {currentStageIndex !== 'default' && <MemoizedStageContainer />}
      </div>
    </div>
  ) 
}
