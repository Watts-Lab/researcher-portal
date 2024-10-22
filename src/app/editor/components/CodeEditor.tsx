'use client'
import YamlEditor from '@uiw/react-textarea-code-editor'
import { useState, useEffect, useMemo } from 'react'
import { parse } from 'yaml'
import { stringify } from 'yaml'
import { StageContext } from '@/editor/stageContext'
import yaml from 'js-yaml'

export default function CodeEditor() {
  const [code, setCode] = useState('')
  const [defaultTreatment, setDefaultTreatment] = useState<any>(null)

  useEffect(() => {
    async function fetchDefaultTreatment() {
      var data = defaultTreatment
      if (defaultTreatment) {
        return // If defaultTreatment is already set, do nothing
      } else {
        const response = await fetch('/defaultTreatment.yaml')
        const text = await response.text()
        data = yaml.load(text)
        setDefaultTreatment(data)
      }

      const storedCode = localStorage.getItem('code') || ''
      if (storedCode === '') {
        setCode(stringify(data))
      } else {
        setCode(storedCode)
      }
    }

    fetchDefaultTreatment()
  }, [])

  function handleChange(evn: any) {
    let entry = evn.target.value
    setCode(entry)
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
        <YamlEditor
          data-cy="code-editor"
          value={code}
          language="yaml"
          placeholder={
            'Please enter treatment configuration. Do not refresh the page before saving.'
          }
          onChange={(env) => handleChange(env)}
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
