import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  TreatmentType,
  stageSchema,
  StageType,
} from '@/../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

export function EditStage({
  treatment,
  editTreatment,
  stageIndex, // an index if the stage already exists, otherwise -1
}: {
  treatment: TreatmentType
  editTreatment: (treatment: TreatmentType) => void
  stageIndex: number
}) {
  var currComponent: StageType | undefined
  if (stageIndex !== -1) {
    currComponent = treatment.gameStages[stageIndex]
  } else {
    currComponent = undefined
  }

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<StageType>({
    defaultValues: {
      name:
        stageIndex !== -1 && currComponent?.name !== undefined
          ? currComponent.name
          : '',
      duration:
        stageIndex !== -1 && currComponent?.duration !== undefined
          ? currComponent.duration
          : undefined,
    },
    resolver: zodResolver(stageSchema),
    mode: 'onChange',
  })

  async function saveEdits() {
    try {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      //if (isValid) {      <------- commented out because of validation
      console.log('Form is valid')
      if (stageIndex === -1) {
        // create new stage
        updatedTreatment?.gameStages?.push({
          name: watch('name'),
          duration: watch('duration'),
          // todo: add discussion component
          elements: [],
        })
      } else {
        // modify existing stage
        updatedTreatment.gameStages[stageIndex].name = watch('name')
        updatedTreatment.gameStages[stageIndex].duration = watch('duration')
        // todo: add discussion component
      }
      console.log(typeof editTreatment)
      editTreatment(updatedTreatment)
      /* } else {
        throw new Error('Form is not valid')  <------- commented out because of validation
      } */
    } catch (error) {
      console.error(error)
    }
  }

  function deleteStage() {
    const confirm = window.confirm(
      'Are you sure you want to delete the stage and all its contents'
    )
    if (confirm) {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      updatedTreatment.gameStages.splice(stageIndex, 1) // delete in place
      editTreatment(updatedTreatment)
    }
  }

  // ----------- Form Questions -----------------

  const htmlElements = []
  htmlElements.push(
    <form>
      {' '}
      {/* onSubmit={handleSubmit(saveEdits)}> */}
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{'Name'}</span>
          </div>
          <input
            {...register('name', { required: true })}
            data-cy={`edit-stage-name-${
              stageIndex === -1 ? 'new' : stageIndex
            }`}
            placeholder="Enter text here."
            className="input input-bordered w-full max-w-xs"
          />
          {errors.name && (
            <span className="text-red-500">
              {typeof errors.name.message === 'string' && errors.name.message}
            </span>
          )}
        </label>
      </div>
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{'Duration'}</span>
          </div>
          <input
            {...register('duration', { required: true, valueAsNumber: true })}
            data-cy={`edit-stage-duration-${
              stageIndex === -1 ? 'new' : stageIndex
            }`}
            placeholder="Enter number here."
            className="input input-bordered w-full max-w-xs"
            type="number"
          />
          {errors.duration && (
            <span className="text-red-500">
              {typeof errors.duration.message === 'string' &&
                errors.duration.message}
            </span>
          )}
        </label>
      </div>
    </form>
  )

  //console.log(watch()); // WATCH ALL INPUTS

  return (
    <div>
      <h1>{stageIndex !== -1 ? 'Edit Stage' : 'Add Stage'}</h1>
      {htmlElements}

      <button
        data-cy={`edit-stage-save-${stageIndex === -1 ? 'new' : stageIndex}`}
        className="btn btn-primary"
        style={{ margin: '10px' }}
        onClick={saveEdits}
        disabled={watch('duration') === undefined || watch('name') === ''}
      >
        Save
      </button>

      {stageIndex !== -1 && (
        <button
          data-cy={`edit-stage-delete-${stageIndex}`}
          className="btn btn-secondary"
          style={{ margin: '10px' }}
          onClick={deleteStage}
        >
          Delete
        </button>
      )}
    </div>
  )
}
