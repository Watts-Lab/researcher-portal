'use client'
import React, { useEffect, useState, useContext, useCallback } from 'react'
import { parse } from 'yaml'
import { StageCard } from './StageCard'
import TimelineTools from './TimelineTools'
import { Modal } from './Modal'
import { EditStage } from './EditStage'
import { StageContext } from '@/editor/stageContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Dropdown from './Dropdown'

export default function Timeline({
  setRenderPanelStage,
}: {
  setRenderPanelStage: any
}) {
  const [scale, setScale] = useState(() => {
    // Retrieve the scale value from localStorage on initial render
    const storedScale = localStorage.getItem('timelineScale');
    return storedScale ? 10 ** (Number(storedScale) / 100) : 1;
  });
  
  const [stageOptions, setStageOptions] = useState<string[]>([])
  const [treatmentOptions, setTreatmentOptions] = useState<string[]>([])
  const [introSequenceOptions, setIntroSequenceOptions] = useState<string[]>([])
  const [currentStageName, setCurrentStageName] = useState('all') // filter for stage names

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
    selectedIntroSequenceIndex,
    setSelectedIntroSequenceIndex,
  } = useContext(StageContext)

  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const codeStr = localStorage.getItem('code') || ''
      const parsedCode = parse(codeStr)
      setTreatment(parsedCode)

      const storedFilter = localStorage.getItem('currentStageName') || 'all'
      setCurrentStageName(storedFilter)

      const storedTreatmentIndex =
        parseInt(localStorage.getItem('selectedTreatmentIndex') || '0', 10)
      setSelectedTreatmentIndex(storedTreatmentIndex)

      const storedIntroSequenceIndex =
        parseInt(localStorage.getItem('selectedIntroSequenceIndex') || '0', 10)
      setSelectedIntroSequenceIndex(storedIntroSequenceIndex)
    }
  }, [setTreatment, setSelectedTreatmentIndex, setSelectedIntroSequenceIndex])

  // think about using useMemo here
  const filterStages = useCallback(
    (treatment: any) => {
      if (!treatment || !treatment.gameStages) return []

      const filteredStages = treatment.gameStages
        .map((stage: any, originalIndex: number) => ({ stage, originalIndex }))
        .filter(({ stage }: { stage: any }) =>
          currentStageName === 'all' ? true : stage.name === currentStageName
        )

      return filteredStages
    },
    [currentStageName]
  )

  useEffect(() => {
    if (treatment) {
      // Set treatment options
      if (treatment.treatments) {
        const treatmentNames = treatment.treatments.map(
          (treatment: any) => treatment.name
        )
        setTreatmentOptions(treatmentNames)

        const selectedTreatment = treatment.treatments[selectedTreatmentIndex]
        const filteredStages = filterStages(selectedTreatment)

        if (filteredStages.length > 0) {
          setCurrentStageIndex(filteredStages[0].originalIndex) // default to first filtered stage, in case some stages have the same name
        }

        const stageNames =
          selectedTreatment?.gameStages?.map((stage: any) => stage.name) || []
        setStageOptions(['all', ...stageNames])
      }

      // Set intro sequence options
      if (treatment.introSequences) {
        const sequenceNames = treatment.introSequences.map(
          (sequence: any, index: number) =>
            sequence.fields?.sequenceName || `Sequence ${index + 1}`
        )
        setIntroSequenceOptions(sequenceNames)
      }

      // Set templates
      if (treatment.templates) {
        const templates = new Map<string, any>()
        treatment.templates.forEach((template: any) => {
          templates.set(template.templateName, template.templateContent)
        })
        setTemplatesMap(templates)
      }
    }
  }, [
    treatment,
    selectedTreatmentIndex,
    selectedIntroSequenceIndex,
    currentStageName,
    setCurrentStageIndex,
    setTemplatesMap,
    filterStages,
  ])

  if (!treatment) {
    return null
  }

  function handleStageNameChange(event: any) {
    const selectedStageName = event.target.value
    setCurrentStageName(selectedStageName)
    localStorage.setItem('currentStageName', selectedStageName)

    if (selectedStageName === 'all') {
      setCurrentStageIndex(0)
    } else {
      const selectedTreatment = treatment.treatments[selectedTreatmentIndex]
      const stageIndex = selectedTreatment.gameStages.findIndex(
        (stage: any) => stage.name === selectedStageName
      )
      setCurrentStageIndex(stageIndex)
    }
  }

  function handleTreatmentChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newIndex = parseInt(event.target.value, 10)
    setCurrentStageIndex(0)
    setSelectedTreatmentIndex(newIndex)
    localStorage.setItem('selectedTreatmentIndex', newIndex.toString())
    setCurrentStageName('all')
    localStorage.setItem('currentStageName', 'all')
  }

  function handleIntroSequenceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newIndex = parseInt(event.target.value, 10)
    setSelectedIntroSequenceIndex(newIndex)
    localStorage.setItem('selectedIntroSequenceIndex', newIndex.toString())
    setCurrentStageName('all')
  }

  // drag and drop handler
  function onDragEnd(result: any) {
    const { destination, source } = result
    if (!destination) {
      return
    }

    const sourceIndex = source.index
    const destIndex = destination.index
    const updatedStages = Array.from(
      treatment.treatments[selectedTreatmentIndex].gameStages
    )
    const [removed] = updatedStages.splice(sourceIndex, 1)
    updatedStages.splice(destIndex, 0, removed)

    // update treatment
    const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
    updatedTreatment.treatments[selectedTreatmentIndex].gameStages =
      updatedStages
    editTreatment(updatedTreatment)
  }

  console.log('treatment', treatment)
  console.log('templatesMap', templatesMap)

  return (
    <div data-cy={'timeline'} id="timeline" className="h-full flex flex-col">
      <TimelineTools setScale={setScale} />

      {/* filter dropdowns */}
      <div className="flex items-center justify-start space-x-6 p-1 bg-slate-200 h-12">
        <Dropdown
          label="Select treatment:"
          options={treatmentOptions}
          value={selectedTreatmentIndex}
          onChange={handleTreatmentChange}
          dataCy="treatments-dropdown"
        />

        <Dropdown
          label="Select intro sequence:"
          options={introSequenceOptions}
          value={selectedIntroSequenceIndex}
          onChange={handleIntroSequenceChange}
          dataCy="intro-sequence-dropdown"
        />

        <Dropdown
          label="Select stage:"
          options={stageOptions}
          value={currentStageName}
          onChange={handleStageNameChange}
          dataCy="stages-dropdown"
        />
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
                      key={obj.originalIndex}
                      draggableId={`treatment-${selectedTreatmentIndex}-stage-${obj.originalIndex}`}
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