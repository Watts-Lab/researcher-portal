import React, { useState, useContext } from 'react'
import { Modal } from './Modal'
import { EditElement } from './EditElement'
import { TreatmentType } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { StageContext } from '../stageContext.jsx'

export function ElementCard({
  element,
  scale,
  stageDuration,
  onSubmit,
  stageIndex,
  elementIndex,
  elementOptions,
}: {
  element: any
  scale: number
  stageDuration: number
  onSubmit: any
  stageIndex: number
  elementIndex: number
  elementOptions: any
}) {
  const startTime = element.displayTime || 0
  const endTime = element.hideTime || stageDuration
  const [modalOpen, setModalOpen] = useState(false)

  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    templatesMap,
    setTemplatesMap,
  } = useContext(StageContext)

  const editModalId = `modal-stage${stageIndex}-element-${elementIndex}`
  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px] justify-center px-5"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
      data-cy={'element-' + stageIndex + '-' + elementIndex}
      tabIndex={0}
    >
      <div>
        {Object.keys(element).map((key) => (
          <p key={key}>
            {key}: {element[key]}
          </p>
        ))}
      </div>
      <button
        data-cy={'edit-element-button-' + stageIndex + '-' + elementIndex}
        className="btn h-5 flex bg-gray-300"
        style={{ minHeight: 'unset' }}
        onClick={() =>
          (
            document.getElementById(editModalId) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        Edit
      </button>

      <Modal id={editModalId}>
        <EditElement stageIndex={stageIndex} elementIndex={elementIndex} />
      </Modal>
    </div>
  )
}
