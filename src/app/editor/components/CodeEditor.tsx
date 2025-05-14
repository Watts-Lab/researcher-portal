'use client'
import { StageContext } from '@/editor/stageContext'
import yaml from 'js-yaml'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor as MonacoEditor } from 'monaco-editor'
import { treatmentFileSchema } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { useState, useEffect, useMemo, useRef } from 'react'
import { parse } from 'yaml'
import { stringify } from 'yaml'
import { ZodError } from 'zod'

// Extend the Window interface to include the editor property
declare global {
  interface Window {
    editor: MonacoEditor.IStandaloneCodeEditor
  }
}

export default function CodeEditor() {
  const [code, setCode] = useState('')
  const [defaultTreatment, setDefaultTreatment] = useState<any>(null)
  const [schemaErrors, setSchemaErrors] = useState([])
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  useEffect(() => {
    async function fetchDefaultTreatment() {
      var data = defaultTreatment
      if (defaultTreatment) return // If defaultTreatment is already set, do nothing

      const response = await fetch('/defaultTreatment.yaml')
      const text = await response.text()
      data = yaml.load(text)
      setDefaultTreatment(data)

      const storedCode = localStorage.getItem('code') || ''
      if (storedCode === '') {
        setCode(stringify(data))
        localStorage.setItem('code', stringify(data))
      } else {
        setCode(storedCode)
      }
    }

    fetchDefaultTreatment()
  }, [])

  function parseYAML(yamlString: string) {
    try {
      const parsedYAML = parse(yamlString)
      return { parsedYAML, errorsYAML: [] }
    } catch (YAMLParseError: any) {
      return {
        parsedYAML: null,
        errorsYAML: [
          {
            message: YAMLParseError.message,
            startLineNumber: YAMLParseError.linePos[0].line,
            endLineNumber: YAMLParseError.linePos[1].line,
            startColumn: YAMLParseError.linePos[0].col,
            endColumn: YAMLParseError.linePos[1].col,
            path: undefined,
          },
        ],
      }
    }
  }

  function validateTreatmentSchema(parsedYAML: any) {
    try {
      treatmentFileSchema.parse(parsedYAML) // this uses Zod's parsing, not YAML's parsing
      return [] // no errors
    } catch (e: any) {
      console.log(`not a valid schema, ${e.errors.length} errors: `, e.errors)
      // filter out errors that come from "elements: []", which is valid
      const filteredErrors = e.errors.filter((error: any) => {
        return !(error.path[-1] !== 'elements' && error.code === 'too_small')
      })
      return formatZodError(filteredErrors)
    }

    return []
  }

  function formatZodError(errors: any) {
    return errors.map((err: any) => {
      // create human-readable path
      const path = err.path.reduce((acc: any, segment: any) => {
        if (typeof segment === 'number') {
          return `${acc}[${segment}]`
        } else if (acc) {
          return `${acc}.${segment}`
        } else {
          // first segment, no leading dot
          return segment
        }
      }, '')

      const location = path.length > 0 ? path : 'root'

      const code = err.code // type of the Zod error (invalid_type, too_small, etc.)

      // extract more detailed info depending on the error code
      let details = ''
      switch (code) {
        case 'invalid_type':
          details = `Expected ${err.expected}, received ${err.received}`
          break
        case 'too_small':
        case 'too_big':
          details = `${err.message} (minimum: ${err.minimum}, maximum: ${err.maximum})`
          break
        default:
          details = err.message
          break
      }

      return {
        message: `${path}: ${details}`,
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 1,
        endColumn: 1,
        path: location,
      }
    })
  }

  function markErrors(errors: any[]) {
    const model = editorRef.current?.getModel()
    if (model && monacoRef.current) {
      monacoRef.current.editor.removeAllMarkers('yaml')

      // errors was setup to have an object stucture that corresponds to markers
      // use startColumn 1, endColumn lineLength to have the whole row(s) highlighted
      const markers = errors.map((error) => ({
        ...error,
        startColumn: 1,
        endColumn: model ? model.getLineLength(error.endLineNumber) : 1,
        severity: monacoRef.current?.MarkerSeverity.Error,
      }))
      console.log('markers: ', markers)
      monacoRef.current.editor.setModelMarkers(model, 'yaml', markers)
    }
  }

  function handleChange(newValue: string) {
    setCode(newValue)
    const { parsedYAML, errorsYAML } = parseYAML(newValue)

    if (errorsYAML && editorRef.current && monacoRef.current) {
      if (schemaErrors.length > 0) {
        errorsYAML.push(...schemaErrors)
      }
      markErrors(errorsYAML)
    }
  }

  function handleSave(e: any) {
    e.preventDefault()
    try {
      // parse the treamtent file, ensuring it's valid YAML
      const { parsedYAML, errorsYAML } = parseYAML(code)

      if (errorsYAML.length > 0 && editorRef.current && monacoRef.current) {
        if (schemaErrors.length > 0) {
          // ensure that any previous schema errors are retained
          errorsYAML.push(...schemaErrors)
        }
        markErrors(errorsYAML)
        console.log('yaml errors: ', errorsYAML)
        //TODO display a little something went wrong pop up
        return
      }

      // validate the treatment file against the treatment schema
      const errorsSchema = validateTreatmentSchema(parsedYAML)
      setSchemaErrors(errorsSchema)
      console.log('schema errors: ', errorsSchema)

      if (errorsSchema.length > 0 && editorRef.current && monacoRef.current) {
        setSchemaErrors(errorsSchema)
        markErrors(errorsSchema)
        //TODO display a little something went wrong pop up
      } else {
        // treatment schema can be parsed and is valid
        localStorage.setItem('code', code)
        window.location.reload() //refresh page to make elements appear on screen
      }
    } catch (e) {
      console.log('Error on Save', e)
      //TODO display a little something went wrong pop up
    }
  }
  return (
    <div>
      <div
        style={{ height: '95vh', overflow: 'auto', backgroundColor: '#F0F2F6' }}
        data-cy="code-editor"
      >
        <Editor
          value={code}
          language="yaml"
          options={{
            wordWrap: 'on',
            showFoldingControls: 'always',
            wrappingIndent: 'same',
            minimap: {
              enabled: true,
            },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
          onChange={(newValue: any) => handleChange(newValue)}
          onMount={(editor: any, monaco: any) => {
            editorRef.current = editor
            monacoRef.current = monaco

            window.editor = editor // Expose the Monaco Editor instance for testing
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
