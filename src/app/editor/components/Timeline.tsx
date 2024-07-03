'use client'
import React, { useEffect, useState } from 'react'
import { parse } from 'yaml'
import { StageCard } from './StageCard'
import TimelineTools from './TimelineTools'
import TimePicker from './TimePicker'
import { stringify } from 'yaml'
import { Modal } from './Modal'
import { EditStage } from './EditStage'
import { TreatmentType } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'

export default function Timeline({
  setRenderPanelStage,
}: {
  setRenderPanelStage: any
}) {
  const [scale, setScale] = useState(1) // pixels per second
  const [treatment, setTreatment] = useState<any | null>(null)

  function editTreatment(newTreatment: TreatmentType) {
    setTreatment(newTreatment)
    localStorage.setItem('code', stringify(newTreatment))
    window.location.reload()
  }
  // Todo: think about using 'useContext' here instead of passing editTreatment all the way down

  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== 'undefined') {
      const codeStr = localStorage.getItem('code') || ''
      const parsedCode = parse(codeStr)
      setTreatment(parsedCode)
    }
  }, [])

  if (!treatment) {
    return null
  }

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
      <div id="timelineCanvas" className="grow min-h-10 bg-slate-600 p-2">
        <div className="flex flex-row flex-nowrap overflow-x-auto gap-x-1 overflow-y-auto">
          {treatment &&
            treatment?.gameStages?.map((stage: any, index: any) => (
              <StageCard
                key={stage.name}
                title={stage.name}
                elements={stage.elements}
                duration={stage.duration}
                scale={scale}
                treatment={treatment}
                setTreatment={setTreatment}
                editTreatment={editTreatment}
                sequence={'gameStage'}
                stageIndex={index}
                setRenderPanelStage={setRenderPanelStage}
              />
            ))}
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
              <EditStage
                treatment={treatment}
                editTreatment={editTreatment}
                stageIndex={-1}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}
