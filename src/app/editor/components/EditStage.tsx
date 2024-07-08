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
    });

  //console.log(isValid);
  async function saveEdits() {
    try {
      console.log("inside saveEdits",isValid)
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      if (isValid) {
        console.log('Form is valid')
<<<<<<< HEAD
        if (stageIndex === undefined) {
=======
        if (stageIndex === -1) {
>>>>>>> eff85369733f57f5aadef409cf3f3d36c5d2ec1d
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
<<<<<<< HEAD
        disabled={watch('duration') === 0 || watch('name') === '' || !isValid}
=======
        disabled={watch('duration') === undefined || watch('name') === ''}
>>>>>>> eff85369733f57f5aadef409cf3f3d36c5d2ec1d
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
