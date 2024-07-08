import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  TreatmentType,
  ElementType,
  elementSchema,
} from '@/../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

export function EditElement({
  treatment,
  editTreatment,
  stageIndex,
  elementIndex, // -1 if adding element
}: {
  treatment: TreatmentType
  editTreatment: (treatment: TreatmentType) => void
  stageIndex: number
  elementIndex: number
}) {
  var currComponent: ElementType | undefined
  if (elementIndex !== -1) {
    currComponent = treatment.gameStages[stageIndex].elements[elementIndex]
  } else {
    currComponent = undefined
  }

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      name:
        elementIndex !== -1 && currComponent?.name !== undefined
          ? currComponent.name
          : '',
      selectedOption:
        elementIndex !== -1 && currComponent?.type !== undefined
          ? currComponent.type
          : 'Pick one',
      file: '',
      url: '',
      params: '',
      onSubmit: '',
      style: '',
      buttonText: '',
      startTime: '',
      endTime: '',
      surveyName: 'Pick one',
    },
    resolver: zodResolver(elementSchema),
    mode: 'onChange',
  })

  function saveEdits() {
    try {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy

      if (stageIndex === undefined) {
        throw new Error('No stage index given')
      }

      const inputs: { name: any; type: any; [key: string]: any } = {
        name: watch('name'),
        type: watch('selectedOption'),
      }

      if (watch('file') !== '') inputs.file = watch('file')
      if (watch('url') !== '') inputs.url = watch('url')
      if (watch('params') !== '') inputs.params = watch('params')
      if (watch('onSubmit') !== '') inputs.onSubmit = watch('onSubmit')
      if (watch('style') !== '') inputs.style = watch('style')
      if (watch('buttonText') !== '') inputs.buttonText = watch('buttonText')
      if (watch('startTime') !== '')
        inputs.startTime = parseInt(watch('startTime'))
      if (watch('endTime') !== '') inputs.endTime = parseInt(watch('endTime'))
      if (watch('surveyName') !== 'Pick one')
        inputs.surveyName = watch('surveyName')

      if (elementIndex === -1) {
        updatedTreatment?.gameStages[stageIndex]?.elements?.push(inputs)
      } else {
        updatedTreatment.gameStages[stageIndex].elements[elementIndex] = inputs
      }

      editTreatment(updatedTreatment)
    } catch (error) {
      console.error(error)
    }
  }

  function deleteElement() {
    const confirm = window.confirm(
      'Are you sure you want to delete the element?'
    )
    if (confirm) {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      updatedTreatment.gameStages[stageIndex].elements.splice(elementIndex, 1) // delete in place
      editTreatment(updatedTreatment)
    }
  }

  function setElementOptions(event: any) {
    setValue('selectedOption', event.target.value)
    setValue('file', '')
    setValue('url', '')
    setValue('params', '')
    setValue('onSubmit', '')
    setValue('style', '')
    setValue('buttonText', '')
    setValue('startTime', '')
    setValue('endTime', '')
    setValue('surveyName', 'Pick one')
  }

  // FORM QUESTIONS
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
            data-cy={`edit-element-name-stage${stageIndex}-element${
              elementIndex || 'new'
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
            <span className="label-text">{'Type'}</span>
          </div>
          <select
            {...register('selectedOption', { required: true })}
            data-cy={`edit-element-type-stage${stageIndex}-element${
              elementIndex || 'new'
            }`}
            className="select select-bordered"
            onChange={(e) => setElementOptions(e)}
          >
            <option disabled>Pick one</option>
            <option value="prompt">Prompt</option>
            <option value="survey">Survey</option>
            <option value="audioElement">Audio Element</option>
            <option value="kitchenTimer">Kitchen Timer</option>
            <option value="qualtrics">Qualtrics</option>
            <option value="separator">Separator</option>
            <option value="submitButton">Submit Button</option>
            <option value="trainingVideo">Training Video</option>
          </select>
        </label>
      </div>
      {(watch('selectedOption') === 'prompt' ||
        watch('selectedOption') === 'audioElement') && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'File Address'}</span>
            </div>
            <input
              {...register('file', { required: true })}
              data-cy={`edit-element-file-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              placeholder="Enter number here."
              className="input input-bordered w-full max-w-xs"
            />
            {errors.file && (
              <span className="text-red-500">
                {typeof errors.file.message === 'string' && errors.file.message}
              </span>
            )}
          </label>
        </div>
      )}
      {watch('selectedOption') === 'kitchenTimer' && (
        <div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{'Start Time'}</span>
              </div>
              <input
                {...register('startTime', { required: true })}
                data-cy={`edit-element-start-time-stage${stageIndex}-element${
                  elementIndex || 'new'
                }`}
                placeholder="Enter text here."
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">{'End Time'}</span>
              </div>
              <input
                {...register('endTime', { required: true })}
                data-cy={`edit-element-end-time-stage${stageIndex}-element${
                  elementIndex || 'new'
                }`}
                placeholder="Enter text here."
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>
        </div>
      )}
      {(watch('selectedOption') === 'qualtrics' ||
        watch('selectedOption') === 'trainingVideo') && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'URL'}</span>
            </div>
            <input
              {...register('url', { required: true })}
              data-cy={`edit-element-url-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
      {watch('selectedOption') === 'qualtrics' && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'Parameters'}</span>
            </div>
            <input
              {...register('params', { required: true })}
              data-cy={`edit-element-params-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
      {watch('selectedOption') === 'separator' && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'Style'}</span>
            </div>
            <input
              {...register('style', { required: true })}
              data-cy={`edit-element-style-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
      {watch('selectedOption') === 'survey' && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'Type'}</span>
            </div>
            <select
              {...register('surveyName', { required: true })}
              className="select select-bordered"
            >
              <option disabled>Pick one</option>
              <option value="CRT">CRT</option>
              <option value="SVI">SVI</option>
              <option value="TIPI">TIPI</option>
              <option value="AttitudeAttributes">AttitudeAttributes</option>
              <option value="AutonomyNeedSatisfaction">
                AutonomyNeedSatisfaction
              </option>
              <option value="AwarenessMonitoringGrowth">
                AwarenessMonitoringGrowth
              </option>
              <option value="AwarenessOfArgumentsYN">
                AwarenessOfArgumentsYN
              </option>
              <option value="ConflictAndViability">ConflictAndViability</option>
              {/*TODO: add remaining surveys*/}
            </select>
          </label>
        </div>
      )}
      {watch('selectedOption') === 'submitButton' && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'Button Text'}</span>
            </div>
            <input
              {...register('buttonText', { required: true })}
              data-cy={`edit-element-button-text-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              placeholder="Enter text here."
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
      )}
    </form>
  )

  return (
    <div>
      <h1>{elementIndex !== -1 ? 'Edit Element' : 'Add Element'}</h1>
      {htmlElements}
      <button
        data-cy={`save-edits-stage-${stageIndex}-element-${
          elementIndex || 'new'
        }`}
        className="btn btn-primary"
        style={{ margin: '10px' }}
        onClick={saveEdits}
        disabled={
          watch('selectedOption') === 'Pick one' || watch('name') === '' // !isValid <- fix elementSchema
        }
      >
        Save
      </button>

      {elementIndex !== -1 && (
        <button
          data-cy={`delete-element-stage-${stageIndex}-element-${
            elementIndex || 'new'
          }`}
          className="btn btn-secondary"
          style={{ margin: '10px' }}
          onClick={deleteElement}
        >
          {'Delete'}
        </button>
      )}
    </div>
  )
}
