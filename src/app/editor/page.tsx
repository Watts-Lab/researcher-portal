'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
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

function EditorPageContent() {

  const [leftWidth, setLeftWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('editor.leftWidth')
      return stored ? Number(stored) : 1000
    }
    return 1000
  })

  const [upperLeftHeight, setUpperLeftHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('editor.upperLeftHeight')
      return stored ? Number(stored) : 500
    }
    return 500
  })

  const { position: leftWidthPosition, separatorProps: codeSeparatorProps } =
    useResizable({
      axis: 'x',
      initial: leftWidth,
      min: 100,
      onResizeEnd: ({ position }) => {
        setLeftWidth(position)
        localStorage.setItem('editor.leftWidth', String(position))
      },
    })

  const { position: upperLeftHeightPosition, separatorProps: timelineSeparatorProps } =
    useResizable({
      axis: 'y',
      initial: upperLeftHeight,
      min: 100,
      // Called after every drag
      onResizeEnd: ({position}) => {
        setUpperLeftHeight(position)
        localStorage.setItem('editor.upperLeftHeight', String(position))
      },
    })

    useEffect(() => {
      if (leftWidth !== leftWidthPosition) {
        setLeftWidth(leftWidthPosition)
      }
    }, [leftWidth, leftWidthPosition])
  
    useEffect(() => {
      if (upperLeftHeight !== upperLeftHeightPosition) {
        setUpperLeftHeight(upperLeftHeightPosition)
      }
    }, [upperLeftHeight, upperLeftHeightPosition])
  
  const [renderElements, setRenderElements] = useState([])
  const [renderPanelStage, setRenderPanelStage] = useState({})

  return (
    <StageProvider>
      <div id="editor" className="flex flex-row h-full w-full">
        <div
          id="leftColumn"
          className="flex flex-col h-full w-full"
          style={{ width: leftWidthPosition }}
        >
          <div
            id="upperLeft"
            className="overflow-auto"
            style={{ minHeight: 200, height: upperLeftHeightPosition }}
          >
            <RenderPanel />
          </div>

          <DraggableSplitter dir="horizontal" {...timelineSeparatorProps} />

          <div id="lowerLeft" className="grow overflow-auto">
            <Timeline setRenderPanelStage={setRenderPanelStage} />
          </div>
        </div>

        <DraggableSplitter dir="vertical" {...codeSeparatorProps} />

        <div id="rightColumn" className="flex-1 min-w-[200px] overflow-auto">
          <CodeEditor language={'yaml'} />
        </div>
      </div>
    </StageProvider>
  )
}


const DynamicEditorPage = dynamic(
  () => Promise.resolve(EditorPageContent),
  { ssr: false }
)

export default DynamicEditorPage