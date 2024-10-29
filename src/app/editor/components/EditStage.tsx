import React from 'react'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import {
  TreatmentType,
  stageSchema,
  StageType,
  ElementType,
} from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { StageContext } from '../stageContext.jsx'

export function EditStage({
  stageIndex, // an index if the stage already exists, otherwise -1
}: {
  stageIndex: number
}) {
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

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StageType>({
    defaultValues: {
      name:
        stageIndex != -1
          ? treatment?.treatments?.[0].gameStages[stageIndex]?.name
          : '',
      duration:
        stageIndex != -1
          ? treatment?.treatments?.[0].gameStages[stageIndex]?.duration
          : 0,
      elements:
        stageIndex != -1
          ? treatment?.treatments?.[0].gameStages[stageIndex]?.elements
          : [],
      // desc: "",
      // discussion: {
      //   chatType: "text",
      //   showNickname: true,
      //   showTitle: false,
      // },
    },
    resolver: zodResolver(stageSchema),
    mode: 'onChange',
  })

  async function saveEdits() {
    const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy

    const inputs: { name: any; duration: any; elements: ElementType[] } = {
      name: watch('name'),
      duration: watch('duration'),
      elements:
        treatment?.treatments?.[0].gameStages[stageIndex]?.elements || [],
      // discussion: undefined,
      // desc: watch('desc'),
    }

    // if (watch('discussion') !== null) inputs.discussion = watch('discussion')
    // if (watch('desc') !== "") inputs.desc = watch('desc')
    // if (watch('elements') !== null) inputs.elements = watch('elements')

    // ZOD SCHEMA VALIDATION NOT WORKING WITH TEMPLATES
    //const result = stageSchema.safeParse(inputs)
    // if (!result.success) {
    //   const parsedError = result.error.errors
    //   if (
    //     parsedError[0].message === 'Array must contain at least 1 element(s)' &&
    //     stageIndex === -1
    //   ) {
    //     // do nothing --> ignore the error
    //   } else {
    //     console.error('Error described below:')
    //     console.error(result.error.errors)
    //     return
    //   }
    // }

    if (stageIndex === -1) {
      // create new stage
      updatedTreatment?.treatments?.[0].gameStages?.push(inputs)
    } else {
      // modify existing stage
      updatedTreatment.treatments[0].gameStages[stageIndex].name = watch('name')
      updatedTreatment.treatments[0].gameStages[stageIndex].duration =
        watch('duration')
      // todo: add discussion component
    }
    editTreatment(updatedTreatment)
  }

  function deleteStage() {
    const confirm = window.confirm(
      'Are you sure you want to delete the stage and all its contents'
    )
    if (confirm) {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      updatedTreatment.treatments[0].gameStages.splice(stageIndex, 1) // delete in place
      editTreatment(updatedTreatment)
    }
  }

  // ----------- Form Questions -----------------

  const htmlElements = (
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
