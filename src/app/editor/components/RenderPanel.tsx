import React, { useEffect, useState, createContext, useContext } from 'react'
import dynamic from 'next/dynamic.js'
import styled, { ExecutionProps, FastOmit } from 'styled-components';
import TimePicker from './TimePicker'
//import { Stage } from './../../../.././deliberation-empirica/client/src/Stage.jsx'
import RenderDelibElement from './RenderDelibElement'

import { StageContext } from '@/editor/stageContext'
import { Substitute } from 'styled-components/dist/types';

const StyleContext = createContext({});

const useStyle = () => useContext(StyleContext);

const withCustomStyles = (Component: any) => {
  // Use styled-components to create a styled version of the passed component
  const StyledComponent = styled(Component)`
    min-height: 30%
    max-width: 100%; 
    overflow: hidden; 
    trnasform: translate(-50%, -50%);
    .min-w-sm.mx-auto.aspect-video.relative {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: auto; // Ensures the video maintains aspect ratio
      max-width: 100%; // Limits the video width to prevent overflow
      height: auto; // Ensures the video maintains aspect ratio
      max-height: 100%; // Limits the video height to prevent overflow
    }
  `;
  // eslint-disable-next-line react/display-name
  return (props: React.JSX.IntrinsicAttributes & FastOmit<Substitute<FastOmit<any, never>, FastOmit<{}, never>>, keyof ExecutionProps> & FastOmit<ExecutionProps, "as" | "forwardedAs"> & { as?: void | undefined; forwardedAs?: void | undefined; }) => (<StyledComponent {...props} />);
};


const Stage = withCustomStyles(dynamic(
  () =>
    import('./../../../.././deliberation-empirica/client/src/Stage.jsx').then(
      (mod) => mod.Stage
    ) as any,
  {
    ssr: false,
  }
))

export function RenderPanel() {
  const [time, setTime] = useState(0)

  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
  } = useContext(StageContext)
  console.log('RenderPanel.tsx current stage index', currentStageIndex)
  console.log('Current Treatment', treatment)

  // const currentStageIndex = Number(localStorage.getItem('currentStageIndex'))

  //const treatment =
  //const currentStage = treatment?.gameStages.?[currentStageIndex]

  //console.log('Current stage', localStorage.getItem('currentStageIndex'))

  return (
    <div className="flex" data-cy="render-panel">
      {currentStageIndex === 'default' && (
        <h1>
          Click on a stage card to preview the stage from a participant view.
        </h1>
      )}
      {currentStageIndex !== 'default' && (
        <div className="min-w-fit">
          <h1>Preview of stage {currentStageIndex} </h1>
          <TimePicker
            value={time + ' s'}
            setValue={setElapsed}
            maxValue={treatment.gameStages[currentStageIndex]?.duration ?? 0}
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
        {currentStageIndex !== 'default' && <Stage />}
      </div>
    </div>
  )
}
