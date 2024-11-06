'use client'
import { StageContext } from '@/editor/stageContext'
import yaml from 'js-yaml'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor as MonacoEditor } from 'monaco-editor'
import { treatmentFileSchema } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { useState, useEffect, useMemo, useRef } from 'react'
import { parse } from 'yaml'
import { stringify } from 'yaml'
import { ZodIssue, ZodError } from 'zod'

export default function CodeEditor() {
  const [code, setCode] = useState('')
  const [defaultTreatment, setDefaultTreatment] = useState<any>(null)
  const [schemaErrors, setSchemaErrors] = useState([])
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

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

  function parseYAML(yamlString: string) {
    try {
      const parsedYAML = parse(yamlString)
      return { success: true, data: parsedYAML }
    } catch (YAMLParseError: any) {
      return {
        success: false,
        error: {
          issues: [
            {
              message: YAMLParseError.message,
              startLineNumber: YAMLParseError.linePos[0].line,
              endLineNumber: YAMLParseError.linePos[1].line,
              startColumn: YAMLParseError.linePos[0].col,
              endColumn: YAMLParseError.linePos[1].col,
              path: undefined,
            },
          ],
        },
      }
    }
  }

  function validateTreatmentSchema(parsedYAML: any[]) {
    try {
      const result = treatmentFileSchema.safeParse(parsedYAML) // this uses Zod's parsing, not YAML's parsing

      if (!result.success) {
        // console.log(`not a valid schema, ${result.error.issues.length} errors: `,result.error.issues)
        // filter out errors that come from "elements: []", which is valid
        result.error.issues = result.error.issues.filter((issue: ZodIssue) => {
          return issue.path[-1] === 'elements' || issue.code !== 'too_small'
        })
        // console.log(`filtered, ${result.error.issues.length} errors remain: `,result.error.issues)
        if (result.error.issues.length === 0) {
          // if no errors remain it means all the errors are acceptable in GUI
          // so success is now true
          return { success: true, data: undefined }
        }
        result.error.issues = formatZodIssues(result.error.issues)
      }

      return result
    } catch (e) {
      // Indicates more fundamental error
      // TODO communicate to user smoothly
      return {
        success: false,
        error: {
          issues: [
            {
              message: `Error with Zod parsing: ${e}`,
              startLineNumber: 1,
              endLineNumber: 1,
              startColumn: 1,
              endColumn: 1,
            },
          ],
        },
      }
    }
  }

  function formatZodIssues(errors: any) {
    return errors.map((issue: any) => {
      // create human-readable path
      const path = issue.path.reduce((acc: any, segment: any) => {
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

      // extract more detailed info depending on the error code
      const code = issue.code // type of the Zod issue (invalid_type, too_small, etc.)
      let details = ''
      switch (code) {
        case 'invalid_type':
          details = `Expected ${issue.expected}, received ${issue.received}`
          break
        case 'too_small':
          details = `${issue.message} (minimum: ${issue.minimum})`
          break
        case 'too_big':
          details = `${issue.message} (maximum: ${issue.maximum})`
          break
        default:
          details = issue.message
          break
      }

      return {
        ...issue,
        message: `${location}: ${details}`,
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
      //console.log('markers: ', markers)
      monacoRef.current.editor.setModelMarkers(model, 'yaml', markers)
    }
  }

  function handleChange(newValue: string) {
    setCode(newValue)
    const resultYaml = parseYAML(newValue)

    if (!resultYaml.success) {
      const newErrors = resultYaml.error?.issues || []
      if (schemaErrors.length > 0) {
        // ensure that any previous schema errors are retained
        newErrors.push(...schemaErrors)
      }
      markErrors(newErrors)
    } else {
      // ensure that any previous schema errors are retained
      markErrors(schemaErrors)
    }
  }

  function handleSave(e: any) {
    e.preventDefault()
    try {
      // parse the treamtent file, ensuring it's valid YAML
      const resultYaml = parseYAML(code)

      if (!resultYaml.success) {
        const newYamlErrors = resultYaml?.error?.issues || []
        //console.log('new yaml errors detected: ', newYamlErrors)
        if (schemaErrors.length > 0) {
          // ensure that any previous schema errors are retained
          newYamlErrors.push(...schemaErrors)
        }
        markErrors(newYamlErrors)
        //TODO display a little something went wrong pop up
        return
      }

      // validate the treatment file against the treatment schema
      const resultSchema = validateTreatmentSchema(resultYaml.data)
      if (!resultSchema.success) {
        const newSchemaErrors = resultSchema.error?.issues || [
          resultSchema.error,
        ]
        //console.log('new schema errors detected: ', newSchemaErrors)
        setSchemaErrors(newSchemaErrors)
        markErrors(newSchemaErrors)
        //TODO display a little something went wrong pop up
      } else {
        // treatment schema can be parsed and is valid
        setSchemaErrors([])
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
