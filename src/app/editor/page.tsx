'use client'
import React, { useState, useEffect } from 'react'
import { useResizable } from 'react-resizable-layout'
import DraggableSplitter from '../components/DraggableSplitter'
import CodeEditor from './components/CodeEditor'
import { RenderPanel } from './components/RenderPanel'
import Timeline from './components/Timeline'

import { StageProvider } from './stageContext.jsx'

const STORAGE_KEYS = {
  leftWidth: 'editor-left-width',
  upperLeftHeight: 'editor-upper-left-height',
}

const defaultStageContext = {
  currentStageIndex: undefined,
  elapsed: 0,
}

export default function EditorPage({}) {
  // Retrieve values from localStorage or set defaults
  const DEFAULT_LEFT_WIDTH = 1000;
  const DEFAULT_UPPER_LEFT_HEIGHT = 500;

  // State for layout dimensions
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [upperLeftHeight, setUpperLeftHeight] = useState(DEFAULT_UPPER_LEFT_HEIGHT);

  // Load saved sizes on mount (only runs in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLeftWidth = localStorage.getItem(STORAGE_KEYS.leftWidth);
      const storedUpperLeftHeight = localStorage.getItem(STORAGE_KEYS.upperLeftHeight);

      if (storedLeftWidth) setLeftWidth(parseInt(storedLeftWidth, 10));
      if (storedUpperLeftHeight) setUpperLeftHeight(parseInt(storedUpperLeftHeight, 10));
    }
  }, []);

  const { position: newLeftWidth, separatorProps: codeSeparatorProps } = useResizable({
    axis: 'x',
    initial: leftWidth,
    min: 250, 
    max: window.innerWidth * 0.75, 
    onResizeEnd: ({ position }) => {
      setLeftWidth(position)
      localStorage.setItem(STORAGE_KEYS.leftWidth, position.toString())
    },
  })

  const { position: newUpperLeftHeight, separatorProps: timelineSeparatorProps } = useResizable({
    axis: 'y',
    initial: upperLeftHeight,
    min: 150, 
    max: window.innerHeight * 0.75, 
    onResizeEnd: ({ position }) => {
      setUpperLeftHeight(position)
      localStorage.setItem(STORAGE_KEYS.upperLeftHeight, position.toString())
    },
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

        <div id="rightColumn" className="flex-1 min-w-[200px] overflow-auto">
          <CodeEditor />
        </div>
      </div>
    </StageProvider>
  )
}
