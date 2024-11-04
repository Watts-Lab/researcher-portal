import React, { useState, useContext } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { elementSchema } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { StageContext } from '../stageContext.jsx'

export function EditElement({
  stageIndex,
  elementIndex, // -1 if adding element
}: {
  stageIndex: number
  elementIndex: number
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
  } = useForm({
    defaultValues: {
      name:
        treatment?.treatments?.[0].gameStages[stageIndex]?.elements[
          elementIndex
        ]?.name || '',
      selectedOption:
        treatment?.treatments?.[0].gameStages[stageIndex]?.elements[
          elementIndex
        ]?.type || 'Pick one',
      file: '',
      url: '',
      params: [],
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
    if (JSON.stringify(watch('params')) !== JSON.stringify([]))
      inputs.params = [] // To fix
    if (watch('onSubmit') !== '') inputs.onSubmit = watch('onSubmit')
    if (watch('style') !== '') inputs.style = watch('style')
    if (watch('buttonText') !== '') inputs.buttonText = watch('buttonText')
    if (watch('startTime') !== '')
      inputs.startTime = parseInt(watch('startTime'))
    if (watch('endTime') !== '') inputs.endTime = parseInt(watch('endTime'))
    if (watch('surveyName') !== 'Pick one')
      inputs.surveyName = watch('surveyName')

    const result = elementSchema.safeParse(inputs)
    if (!result.success) {
      // To add: render error message
      console.log('Error message below:')
      console.error(result.error.errors)
      return
    }

    if (elementIndex === -1) {
      updatedTreatment?.treatments[0].gameStages[stageIndex]?.elements?.push(
        inputs
      )
    } else {
      updatedTreatment.treatments[0].gameStages[stageIndex].elements[
        elementIndex
      ] = inputs
    }

    editTreatment(updatedTreatment)
  }

  function deleteElement() {
    const confirm = window.confirm(
      'Are you sure you want to delete the element?'
    )
    if (confirm) {
      const updatedTreatment = JSON.parse(JSON.stringify(treatment)) // deep copy
      updatedTreatment.treatments[0].gameStages[stageIndex].elements.splice(
        elementIndex,
        1
      ) // delete in place
      editTreatment(updatedTreatment)
    }
  }

  function setElementOptions(event: any) {
    setValue('selectedOption', event.target.value)
    setValue('file', '')
    setValue('url', '')
    setValue('params', [])
    setValue('onSubmit', '')
    setValue('style', '')
    setValue('buttonText', '')
    setValue('startTime', '')
    setValue('endTime', '')
    setValue('surveyName', 'Pick one')
  }

  // FORM QUESTIONS
  const htmlElements = (
    <form onSubmit={handleSubmit(saveEdits)}>
      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">{'Name'}</span>
          </div>
          <input
            {...register('name', { required: true })}
            data-cy={`edit-element-name-${stageIndex}-${
              elementIndex === -1 ? 'new' : elementIndex
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
            data-cy={`edit-element-type-${stageIndex}-${
              elementIndex === -1 ? 'new' : elementIndex
            }`}
            className="select select-bordered"
            onChange={(e) => setElementOptions(e)}
          >
            <option disabled>Pick one</option>
            <option value="prompt">Prompt</option>
            <option value="survey">Survey</option>
            <option value="audio">Audio Element</option>
            <option value="timer">Kitchen Timer</option>
            <option value="qualtrics">Qualtrics</option>
            <option value="separator">Separator</option>
            <option value="submitButton">Submit Button</option>
            <option value="video">Training Video</option>
          </select>
        </label>
      </div>
      {(watch('selectedOption') === 'prompt' ||
        watch('selectedOption') === 'audio') && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'File Address'}</span>
            </div>
            <input
              {...register('file', { required: true })}
              data-cy={`edit-element-file-${stageIndex}-${
                elementIndex === -1 ? 'new' : elementIndex
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
      {watch('selectedOption') === 'timer' && (
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
        watch('selectedOption') === 'video') && (
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{'URL'}</span>
            </div>
            <input
              {...register('url', { required: true })}
              data-cy={`edit-element-url-${stageIndex}-${
                elementIndex === -1 ? 'new' : elementIndex
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
              {...register('params')}
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
            <select
              {...register('style', { required: true })}
              data-cy={`edit-element-style-stage${stageIndex}-element${
                elementIndex || 'new'
              }`}
              className="select select-bordered"
            >
              <option value="thin">Thin</option>
              <option value="thick">Thick</option>
              <option value="regular">Regular</option>
            </select>
            {errors.style && (
              <span className="text-red-500">
                {typeof errors.style.message === 'string' &&
                  errors.style.message}
              </span>
            )}
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
              data-cy={`edit-element-surveyName-${stageIndex}-${
                elementIndex === -1 ? 'new' : elementIndex
              }`}
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
        data-cy={`edit-element-save-${stageIndex}-${
          elementIndex === -1 ? 'new' : elementIndex
        }`}
        className="btn btn-primary"
        style={{ margin: '10px' }}
        onClick={saveEdits}
        disabled={watch('name') === ''} // || watch('selectedOption') === 'Pick one' (pick one isnt in element type?)
      >
        Save
      </button>

      {elementIndex !== -1 && (
        <button
          data-cy={`edit-element-delete-${stageIndex}-${
            elementIndex === -1 ? 'new' : elementIndex
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
