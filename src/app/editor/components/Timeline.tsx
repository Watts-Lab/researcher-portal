'use client'
import React, { useEffect, useState, useContext, useCallback } from 'react'
import { parse } from 'yaml'
import { StageCard } from './StageCard'
import TimelineTools from './TimelineTools'
import { stringify } from 'yaml'
import { Modal } from './Modal'
import { EditStage } from './EditStage'
import {
  treatmentSchema,
  TreatmentType,
} from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { StageContext } from '@/editor/stageContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function Timeline({
  setRenderPanelStage,
}: {
  setRenderPanelStage: any
}) {
  const [scale, setScale] = useState(1) // pixels per second
  const [selectedTreatmentIndex, setSelectedTreatmentIndex] = useState(() => {
    const savedIndex = localStorage.getItem('selectedTreatmentIndex')
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0
  })
  const [stageOptions, setStageOptions] = useState<string[]>([])
  const [treatmentOptions, setTreatmentOptions] = useState<string[]>([])
  const [filterCriteria, setFilterCriteria] = useState('all')

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
  } = useContext(StageContext)

  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const codeStr = localStorage.getItem('code') || ''
      const parsedCode = parse(codeStr)
      setTreatment(parsedCode)

      const storedFilter = localStorage.getItem('filterCriteria') || 'all'
      setFilterCriteria(storedFilter)

      // generate dynamic selector options
      if (parsedCode && parsedCode.treatments) {
        const treatmentNames = parsedCode.treatments.map(
          (treatment: any) => treatment.name
        )
        setTreatmentOptions(treatmentNames)

        const stageNames =
          parsedCode.treatments[0]?.gameStages?.map(
            (stage: any) => stage.name
          ) || []
        setStageOptions(['all', ...stageNames]) // 'all' as default
      }

      if (parsedCode?.templates) {
        const templates = new Map<string, any>()
        parsedCode.templates.forEach((template: any) => {
          templates.set(template.templateName, template.templateContent)
        })
        setTemplatesMap(templates)
      }
    }
  }, [setTreatment])

  const filterStages = useCallback(
    (treatment: any) => {
      // think about using useMemo here
      if (!treatment || !treatment.gameStages) return []

      const filteredStages = treatment.gameStages
        .map((stage: any, originalIndex: number) => ({ stage, originalIndex }))
        .filter(({ stage }: { stage: any }) =>
          filterCriteria === 'all' ? true : stage.name === filterCriteria
        )

      console.log('Filtered Stages:', filteredStages)

      return filteredStages
    },
    [filterCriteria]
  )

  useEffect(() => {
    const selectedTreatment = treatment?.treatments?.[selectedTreatmentIndex]
    const filteredStages = filterStages(selectedTreatment)
    if (filteredStages.length > 0)
      setCurrentStageIndex(filteredStages[0].originalIndex)

    // update stage filter options when treatment changes
    const stageNames =
      selectedTreatment?.gameStages?.map((stage: any) => stage.name) || []
    setStageOptions(['all', ...stageNames])
  }, [
    filterCriteria,
    selectedTreatmentIndex,
    treatment,
    setCurrentStageIndex,
    filterStages,
  ])

  //if (!treatment) return null

  function handleFilterChange(event: any) {
    setFilterCriteria(event.target.value)
    localStorage.setItem('filterCriteria', event.target.value)
  }

  function handleTreatmentChange(event: any) {
    setSelectedTreatmentIndex(event.target.value)
    localStorage.setItem('selectedTreatmentIndex', event.target.value)
  }

  // drag and drop handler
  function onDragEnd(result: any) {
    const { destination, source } = result
    if (!destination) {
      return
    }

    const sourceIndex = source.index
    const destIndex = destination.index
    const updatedStages = Array.from(treatment.treatments[0].gameStages)
    const [removed] = updatedStages.splice(sourceIndex, 1)
    updatedStages.splice(destIndex, 0, removed)

    // update treatment
    const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
    updatedTreatment.treatments[0].gameStages = updatedStages
    editTreatment(updatedTreatment)
  }

  console.log('treatment', treatment)
  console.log('templatesMap', templatesMap)

  return (
    <div data-cy={'timeline'} id="timeline" className="h-full flex flex-col">
      <TimelineTools setScale={setScale} />

      {/* Dropdowns container */}
      <div className="flex items-center justify-start space-x-6 p-1 bg-slate-200 h-12">
        {/* select treatment dropdown */}
        <div
          data-cy="treatment-dropdown"
          className="flex items-center space-x-2"
        >
          <label className="text-gray font-medium">Select treatment:</label>
          <select
            value={selectedTreatmentIndex}
            onChange={handleTreatmentChange}
            className="select select-bordered bg-white text-gray-700 font-medium h-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate max-w-xs"
          >
            {treatmentOptions.map((option, index) => (
              <option key={index} value={index} className="truncate">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* select stage dropdown */}
        <div data-cy="stages-dropdown" className="flex items-center space-x-2">
          <label className="text-gray font-medium">Select stage:</label>
          <select
            value={filterCriteria}
            onChange={handleFilterChange}
            className="select select-bordered bg-white text-gray-700 font-medium h-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate max-w-xs"
          >
            {stageOptions.map((option, index) => (
              <option key={index} value={option} className="truncate">
                {option === 'all' ? 'All Stages' : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        id="timelineCanvas"
        className="grow min-h-10 bg-slate-600 p-2 overflow-y-auto overflow-x-auto"
      >
        <div className="flex flex-row flex-nowrap overflow-x-auto gap-x-1 overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-timeline" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-row gap-x-1"
                >
                  {filterStages(
                    treatment?.treatments?.[selectedTreatmentIndex]
                  )?.map((obj: any, index: any) => (
                    <Draggable
                      key={obj.stage.name}
                      draggableId={`stage-${obj.originalIndex}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <StageCard
                            title={obj.stage.name}
                            elements={obj.stage.elements}
                            duration={obj.stage.duration}
                            scale={scale}
                            sequence={'gameStage'}
                            stageIndex={obj.originalIndex}
                            setRenderPanelStage={setRenderPanelStage}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="card bg-slate-300 w-12 m-1 opacity-50 flex items-center">
            <button
              data-cy="add-stage-button"
              className="btn"
              onClick={() =>
                (
                  document.getElementById(
                    'modal-add-stage'
                  ) as HTMLDialogElement | null
                )?.showModal()
              }
            >
              +
            </button>
            <Modal id={'modal-add-stage'}>
              <EditStage stageIndex={-1} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}
