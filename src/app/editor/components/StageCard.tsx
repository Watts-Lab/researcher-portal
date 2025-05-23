'use client'
import React, { useState, useContext } from 'react'
import { ElementCard } from './ElementCard'
import { cn } from '@/components/utils'
import { Modal } from './Modal'
import { EditStage } from './EditStage'
import { EditElement } from './EditElement'
import {
  TreatmentType,
  DurationType,
} from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { setCurrentStageIndex } from './utils'
import { useStage } from '../../../../@empirica-mocks/core/mocks'
import { StageContext } from '../stageContext.jsx'
import { Droppable, Draggable, DragDropContext } from '@hello-pangea/dnd'

export function StageCard({
  title,
  elements,
  duration,
  scale,
  sequence,
  stageIndex,
  setRenderPanelStage,
  isTemplate,
}: {
  title: string
  elements: any[]
  duration: DurationType
  scale: number
  sequence: string
  stageIndex: number
  setRenderPanelStage: any
  isTemplate: boolean
}) {
  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    editTreatment,
    templatesMap,
    setTemplatesMap,
    selectedTreatmentIndex,
    setSelectedTreatmentIndex,
  } = useContext(StageContext)

  const addElementOptions = [
    { question: 'Name', responseType: 'text' },
    {
      question: 'Type',
      responseType: 'dropdown',
      options: [
        'prompt',
        'survey',
        'audioElement',
        'kitchenTimer',
        'qualtrics',
        'separator',
        'submitButton',
        'trainingVideo',
      ],
    },
  ]
  const addStageOptions = [
    { question: 'Name', responseType: 'text' },
    { question: 'Duration', responseType: 'number' },
    { question: 'Discussion', responseType: 'text' },
  ]

  const width = duration ? scale * duration : 'auto'

  function handleStageClick() {
    // setCurrentStageIndex(stageIndex)
    // console.log('setting current stage to ', stageIndex)
    //@ts-ignore

    console.log('setting current stage to ', stageIndex)
    setCurrentStageIndex(stageIndex)

    // setRenderPanelStage({
    //   title: title,
    //   elements: elements,
    //   duration: duration,
    //   stageIndex: stageIndex,
    // })
  }

  function onDragEnd(result: any) {
    const { source, destination } = result
    if (!destination) {
      return
    }

    const sourceIndex = source.index
    const destIndex = destination.index
    const updatedElements = Array.from(elements)
    const [removed] = updatedElements.splice(sourceIndex, 1)
    updatedElements.splice(destIndex, 0, removed)

    // update treatment
    const updatedTreatment = JSON.parse(JSON.stringify(treatment))
    updatedTreatment.treatments[selectedTreatmentIndex].gameStages[
      stageIndex
    ].elements = updatedElements
    editTreatment(updatedTreatment)
  }

  const newElementModalId = `modal-stage${stageIndex}-element-new`

  return (
    <div
      id={`timelineCard ${stageIndex}`}
      className={cn(
        'card grow-0 shrink-0',
        sequence === 'gameStage' ? 'bg-slate-300' : 'bg-red-300'
      )}
      style={{ width: scale * duration }}
      onClick={handleStageClick}
      data-cy={'stage-card-' + stageIndex}
      tabIndex={0}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 className="mx-3 my-2">{title}</h3>
        {!isTemplate && (
          <button
            data-cy={'edit-stage-button-' + stageIndex}
            className="my-3 mx-3 btn h-5 bg-gray-300"
            style={{ minHeight: 'unset' }}
            onClick={() =>
              (
                document.getElementById(
                  'modal-edit-stage-' + stageIndex
                ) as HTMLDialogElement | null
              )?.showModal()
            }
          >
            Edit
          </button>
        )}

        <Modal id={'modal-edit-stage-' + stageIndex}>
          <EditStage stageIndex={stageIndex} />
        </Modal>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId={`droppable-elements-${stageIndex}`}
          direction="vertical"
        >
          {(provided) => (
            <div
              id="elementList"
              className="flex flex-col gap-y-1"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {elements !== undefined &&
                elements.map((element, index) =>
                  isTemplate ? (
                    <div
                      key={`element-${selectedTreatmentIndex}-${stageIndex}-${index}`}
                    >
                      <ElementCard
                        key={`element ${index}`}
                        element={element}
                        scale={scale}
                        stageDuration={duration}
                        stageIndex={stageIndex}
                        elementIndex={index}
                        elementOptions={addElementOptions}
                        onSubmit={''}
                        isTemplate={isTemplate}
                      />
                    </div>
                  ) : (
                    <Draggable
                      key={`element-${selectedTreatmentIndex}-${stageIndex}-${index}`}
                      draggableId={`element-${selectedTreatmentIndex}-${stageIndex}-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-cy={`element-drag-${stageIndex}-${index}`}
                          tabIndex={0}
                        >
                          <ElementCard
                            key={`element ${index}`}
                            element={element}
                            scale={scale}
                            stageDuration={duration}
                            stageIndex={stageIndex}
                            elementIndex={index}
                            elementOptions={addElementOptions}
                            onSubmit={''}
                            isTemplate={isTemplate}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Element Button*/}
      {!isTemplate && (
        <div className="card bg-slate-100 opacity-50 shadow-md m-1 min-h-12 flex items-center">
          <button
            data-cy={'add-element-button-' + stageIndex}
            className="btn h-full w-full"
            onClick={() =>
              (
                document.getElementById(
                  newElementModalId
                ) as HTMLDialogElement | null
              )?.showModal()
            }
          >
            +
          </button>

          <Modal id={newElementModalId}>
            <EditElement stageIndex={stageIndex} elementIndex={-1} />
          </Modal>
        </div>
      )}
    </div>
  )
}
