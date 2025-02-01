import React, { useState } from 'react'
import { cn } from './utils'

export default function DraggableSplitter({
  id = 'drag-bar',
  dir,
  isDragging,
  ...props
}: any) {
  const dataCy = dir === 'horizontal' ? 'splitter-horizontal' : 'splitter-vertical'
  return (
    <div
      id={id}
      data-testid={id}
      data-cy={dataCy} 
      tabIndex={0}
      className={cn(
        'bg-gray-200',
        'shrink-0',
        dir === 'horizontal'
          ? 'w-full h-1 cursor-row-resize'
          : 'w-1 h-full cursor-col-resize',
        'hover:bg-gray-400'
      )}
      {...props}
    />
  )
}
