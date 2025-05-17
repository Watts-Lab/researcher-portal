import React, { useState, useContext, useEffect } from 'react'
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
  isTemplate,
}: {
  element: any
  scale: number
  stageDuration: number
  onSubmit: any
  stageIndex: number
  elementIndex: number
  elementOptions: any
  isTemplate: boolean
}) {
  const startTime = element.displayTime || 0
  const endTime = element.hideTime || stageDuration
  const [modalOpen, setModalOpen] = useState(false)

  const [isElementTemplate, setIsElementTemplate] = useState(false)

  useEffect(() => {
    if (element.template) {
      setIsElementTemplate(true)
    }
  }, [element])

  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    templatesMap,
    setTemplatesMap,
    selectedTreatmentIndex,
    setSelectedTreatmentIndex,
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
        {Object.keys(element).map((key) => {
          const value = element[key]
          return (
            <p key={key}>
              {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
            </p>
          )
        })}
      </div>

      {!isElementTemplate && !isTemplate && (
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
      )}

      <Modal id={editModalId}>
        <EditElement stageIndex={stageIndex} elementIndex={elementIndex} />
      </Modal>
    </div>
  )
}
