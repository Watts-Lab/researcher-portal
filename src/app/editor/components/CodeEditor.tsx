'use client'
import Editor from '@monaco-editor/react'
import { useState, useEffect, useMemo } from 'react'
import { parse } from 'yaml'
import { stringify } from 'yaml'

export default function CodeEditor() {
  const [code, setCode] = useState('')

  const defaultTreatment = useMemo(
    () => ({
      name: 'Example Treatment',
      desc: 'Run through the entire negotiation sequence.',
      playerCount: 3,
      assignPositionsBy: 'random',
      gameStages: [
        {
          name: 'Role Assignment and General Instructions',
          duration: 300,
          desc: 'Assign participants a role',
          elements: [
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/01a_instructions_3_way_negotiation.md',
              showToPositions: [0],
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/01b_instructions_3_way_negotiation.md',
              showToPositions: [1],
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/01c_instructions_3_way_negotiation.md',
              showToPositions: [2],
            },
            {
              type: 'submitButton',
            },
          ],
        },
        {
          name: 'Main Discussion',
          duration: 600,
          desc: 'Main Discussion Time',
          discussion: {
            showNickname: false,
            showTitle: true,
          },
          elements: [
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/03a_rep_a.md',
              showToPositions: [0],
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/03b_rep_b.md',
              showToPositions: [1],
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/03c_rep_c.md',
              showToPositions: [2],
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/05_response_submission.md',
            },
            {
              type: 'separator',
              style: 'thin',
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/06_multipleChoice_agreement_submission.md',
              name: 'dealsheet1',
            },
            {
              type: 'prompt',
              file: 'projects/3-way-negotiation/06_multipleChoice_agreement_submission_inclusion.md',
              name: 'dealsheet2',
            },
            {
              type: 'submitButton',
              buttonText: 'Submit Now and End Negotiation',
            },
          ],
        },
      ],
    }),
    []
  )

  useEffect(() => {
    let value
    // Get the value from local storage if it exists
    value = localStorage.getItem('code') || ''
    if (value === '') {
      setCode(stringify(defaultTreatment))
    } else {
      setCode(value)
    }
  }, [defaultTreatment])

  function handleChange(newValue: any) {
    console.log('newValue from editor OnChange: ', newValue)
    setCode(newValue)
  }

  function handleSave(e: any) {
    //TODO validation should occur here
    e.preventDefault()
    try {
      parse(code)
      localStorage.setItem('code', code)
      window.location.reload() //refresh page to make elements appear on screen
    } catch (YAMLParseError) {
      console.log('Parse Error on Save', YAMLParseError)
      //TODO also display a little something went wrong pop up
    }
  }
  return (
    <div>
      <div
        style={{ height: '95vh', overflow: 'auto', backgroundColor: '#F0F2F6' }}
      >
        <Editor
          data-cy="code-editor"
          value={code}
          language="yaml"
          options={{
            wordWrap: 'on',
            showFoldingControls: 'always',
          }}
          defaulValue={
            'Please enter treatment configuration. Do not refresh the page before saving.'
          }
          onChange={(newValue) => handleChange(newValue)}
          padding={5}
          style={{
            fontSize: 12,
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            backgroundColor: '#F0F2F6',
          }}
        />
      </div>
      <div style={{ backgroundColor: '#F0F2F6' }}>
        <button
          data-cy="yaml-save"
          className="btn btn-primary"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <div>{/* <Timeline /> */}</div>
    </div>
  )
}
