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
  stageIndex, // a number if the stage already exists, otherwise undefined
}: {
  treatment: TreatmentType
  editTreatment: (treatment: TreatmentType) => void
  stageIndex: number
}) {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<StageType>(
    stageIndex !== undefined
      ? {
          defaultValues: {
            name: treatment.gameStages[stageIndex].name,
            duration: treatment.gameStages[stageIndex].duration,
          },
          resolver: zodResolver(stageSchema),
          mode: 'onChange',
        }
      : {}
  )

  async function saveEdits() {
    try {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      if (isValid) {
        console.log('Form is valid')
        if (stageIndex === undefined) {
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
      } else {
        throw new Error('Form is not valid')
      }
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
    <form onSubmit={handleSubmit(saveEdits)}>
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{'Name'}</span>
          </div>
          <input
            {...register('name', { required: true })}
            data-cy={`edit-stage-name-${stageIndex || 'new'}`}
            placeholder="Enter text here."
            className="input input-bordered w-full max-w-xs"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
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
            data-cy={`edit-stage-duration-${stageIndex || 'new'}`}
            placeholder="Enter number here."
            className="input input-bordered w-full max-w-xs"
            type="number"
          />
          {errors.duration && (
            <span className="text-red-500">{errors.duration.message}</span>
          )}
        </label>
      </div>
    </form>
  )

  //console.log(watch()); // WATCH ALL INPUTS

  return (
    <div>
      <h1>{stageIndex !== undefined ? 'Edit Stage' : 'Add Stage'}</h1>
      {htmlElements}

      <button
        data-cy={`save-edits-stage-${stageIndex || 'new'}`}
        className="btn btn-primary"
        style={{ margin: '10px' }}
        onClick={saveEdits}
        disabled={watch('duration') === 0 || watch('name') === ''}
      >
        Save
      </button>

      {/* Todo: Do we want to hide the delete button when creating a new stage? */}
      <button
        data-cy={`delete-stage-${stageIndex || 'new'}`}
        className="btn btn-secondary"
        style={{ margin: '10px' }}
        onClick={deleteStage}
      >
        Delete
      </button>
    </div>
  )
}