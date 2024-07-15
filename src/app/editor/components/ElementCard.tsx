import React, { useState } from 'react'
import { Modal } from './Modal'
import { EditElement } from './EditElement'
import { TreatmentType } from '@/../deliberation-empirica/server/src/preFlight/validateTreatmentFile'

export function ElementCard({
  element,
  scale,
  stageDuration,
  onSubmit,
  stageIndex,
  elementIndex,
  treatment,
  editTreatment,
  elementOptions,
}: {
  element: any
  scale: number
  stageDuration: number
  onSubmit: any
  stageIndex: number
  elementIndex: number
  treatment: any
  editTreatment: (treatment: TreatmentType) => void
  elementOptions: any
}) {
  const startTime = element.displayTime || 0
  const endTime = element.hideTime || stageDuration
  const [modalOpen, setModalOpen] = useState(false)

  const editModalId = `modal-stage${stageIndex}-element-${elementIndex}`
  return (
    <div
      className="card bg-base-200 shadow-md min-h-12 min-w-[10px] justify-center px-5"
      style={{ left: startTime * scale, width: scale * (endTime - startTime) }}
      data-cy={'element-' + stageIndex + '-' + elementIndex}
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
        <EditElement
          treatment={treatment}
          editTreatment={editTreatment}
          stageIndex={stageIndex}
          elementIndex={elementIndex}
        />
      </Modal>
    </div>
  )
}
