'use client'
import React, { useState } from 'react'
import { ElementCard } from './ElementCard'
import { cn } from '@/app/components/utils'
import { Modal } from './Modal'
import { EditStage } from './EditStage'
import { EditElement } from './EditElement'
import {
  TreatmentType,
  DurationType,
} from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'

export function StageCard({
  title,
  elements,
  duration,
  scale,
  treatment,
  setTreatment, //Todo: get rid of this entirely
  editTreatment,
  sequence,
  stageIndex,
  setRenderPanelStage,
}: {
  title: string
  elements: any[]
  duration: DurationType
  scale: number
  treatment: any
  setTreatment: any
  editTreatment: (treatment: TreatmentType) => void
  sequence: string
  stageIndex: number
  setRenderPanelStage: any
}) {
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
    setRenderPanelStage({
      title: title,
      elements: elements,
      duration: duration,
      stageIndex: stageIndex,
    })
  }

  const newElementModalId = `modal-stage${stageIndex}-element-new`

  return (
    // TODO: reorder elements with drag and drop
    <div
      id={`timelineCard ${stageIndex}`}
      className={cn(
        'card grow-0 shrink-0',
        sequence === 'gameStage' ? 'bg-slate-300' : 'bg-red-300'
      )}
      style={{ width: scale * duration }}
      onClick={handleStageClick}
      data-cy={'stage-' + stageIndex}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 className="mx-3 my-2">{title}</h3>
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

        <Modal id={'modal-edit-stage-' + stageIndex}>
          <EditStage
            treatment={treatment}
            editTreatment={editTreatment}
            stageIndex={stageIndex}
          />
        </Modal>
      </div>

      <div id="elementList" className="flex flex-col gap-y-1">
        {elements !== undefined &&
          elements.map((element, index) => (
            <ElementCard
              key={`element ${index}`}
              element={element}
              scale={scale}
              stageDuration={duration}
              stageIndex={stageIndex}
              elementIndex={index}
              treatment={treatment}
              editTreatment={editTreatment}
              elementOptions={addElementOptions}
              onSubmit={''}
            />
          ))}
        {/* Add Element Button*/}
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
            <EditElement
              treatment={treatment}
              editTreatment={editTreatment}
              stageIndex={stageIndex}
              elementIndex={-1}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
