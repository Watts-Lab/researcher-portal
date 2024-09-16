'use client'
import React, { useState } from 'react'
import { useResizable } from 'react-resizable-layout'
import DraggableSplitter from '../components/DraggableSplitter'
import CodeEditor from './components/CodeEditor'
import { RenderPanel } from './components/RenderPanel'
import Timeline from './components/Timeline'

import { StageProvider } from './stageContext.jsx'

const defaultStageContext = {
  currentStageIndex: undefined,
  elapsed: 0,
}

export default function EditorPage({}) {
  const { position: leftWidth, separatorProps: codeSeparatorProps } =
    useResizable({
      axis: 'x',
      initial: 1000,
      min: 100,
    })

  console.log('page.tsx, context', defaultStageContext)

  const { position: upperLeftHeight, separatorProps: timelineSeparatorProps } =
    useResizable({
      axis: 'y',
      initial: 500,
    })

  const [renderElements, setRenderElements] = useState([])
  const [renderPanelStage, setRenderPanelStage] = useState({})

  return (
    <StageProvider>
      <div id="editor" className="flex flex-row h-full w-full">
        <div
          id="leftColumn"
          className="flex flex-col h-full w-full"
          style={{ width: leftWidth }}
        >
          <div
            id="upperLeft"
            className="overflow-auto"
            style={{ minHeight: 200, height: upperLeftHeight }}
          >
            <RenderPanel />
          </div>

          <DraggableSplitter dir="horizontal" {...timelineSeparatorProps} />

          <div id="lowerLeft" className="grow overflow-auto">
            <Timeline setRenderPanelStage={setRenderPanelStage} />
          </div>
        </div>

        <DraggableSplitter dir="vertical" {...codeSeparatorProps} />

        <div id="rightColumn" className="grow">
          <CodeEditor />
        </div>
      </div>
    </StageProvider>
  )
}
