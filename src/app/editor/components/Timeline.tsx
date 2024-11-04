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
  const [filterCriteria, setFilterCriteria] = useState('all') // state for selected filter
  const [filterOptions, setFilterOptions] = useState<string[]>([]) // state to store filter options (stage names)

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

      const storedFilter = localStorage.getItem('filterCriteria') || 'all' // persist filter option
      setFilterCriteria(storedFilter)

      // generate dynamic selector options
      if (parsedCode && parsedCode.treatments?.[0].gameStages) {
        const stageNames = parsedCode.treatments[0].gameStages.map(
          (stage: any) => stage.name
        )
        setFilterOptions(['all', ...stageNames]) // 'all' as default
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
      if (!treatment) return []

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

  // change stage index whenever filterCriteria changes
  useEffect(() => {
    const filteredStages = filterStages(treatment?.treatments?.[0])
    if (filteredStages.length > 0) {
      setCurrentStageIndex(filteredStages[0].originalIndex)
    }
  }, [filterCriteria, treatment, setCurrentStageIndex, filterStages])

  if (!treatment) {
    return null
  }

  function handleFilterChange(event: any) {
    setFilterCriteria(event.target.value)
    localStorage.setItem('filterCriteria', event.target.value)
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

  //const parsedCode = "";

  // TODO: add a page before this that lets the researcher select what treatment to work on

  // if we pass in a 'list' in our yaml (which we do when the treatments are in a list) then we take the first component of the treatment

  const addStageOptions = [
    { question: 'Name', responseType: 'text' },
    { question: 'Duration', responseType: 'text' },
    { question: 'Discussion', responseType: 'text' },
  ]

  return (
    <div data-cy={'timeline'} id="timeline" className="h-full flex flex-col">
      <TimelineTools setScale={setScale} />

      {/* select section dropdown */}
      <div
        className="flex items-center justify-start space-x-2 p-1 bg-slate-200 h-12"
        data-cy="filter-dropdown"
      >
        <label className="text-gray font-medium">Select section:</label>
        <select
          value={filterCriteria}
          onChange={handleFilterChange}
          className="select select-bordered bg-white text-gray-700 font-medium h-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate max-w-xs"
        >
          {filterOptions.map((option, index) => (
            <option key={index} value={option} className="truncate">
              {option === 'all' ? 'All Stages' : option}
            </option>
          ))}
        </select>
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
                  {filterStages(treatment?.treatments?.[0])?.map(
                    (obj: any, index: any) => (
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
                    )
                  )}
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
