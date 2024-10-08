'use client'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor as MonacoEditor, IRange } from 'monaco-editor'
import { treatmentSchema } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { useState, useEffect, useMemo, useRef } from 'react'
import { parse, parseDocument } from 'yaml'
import { stringify } from 'yaml'
import { ZodError } from 'zod'

export default function CodeEditor() {
  const [code, setCode] = useState('')
  const [schemaErrors, setSchemaErrors] = useState([])
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

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
      treatmentSchema.parse(parsedYAML) // this uses Zod's parsing, not YAML's parsing
      return [] // no errors
    } catch (e: any) {
      console.log(`not a valid schema, ${e.errors.length} errors: `, e.errors)
      return formatZodError(e)
    }

    return []
  }

  function formatZodError(error: any) {
    return error.errors.map(
      (err: {
        path: any[]
        code: any
        expected: any
        received: any
        message: string
        minimum: any
        maximum: any
      }) => {
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
      }
    )
  }

  function markErrors(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco,
    errors: any[]
  ) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.removeAllMarkers('yaml')
    }

    // errors was setup to have an object stucture that corresponds to markers
    // use startColumn 1, endColumn lineLength to have the whole row(s) highlighted
    const markers = errors.map((error: { endLineNumber: any }) => ({
      ...error,
      startColumn: 1,
      endColumn: model ? model.getLineLength(error.endLineNumber) : 1,
    }))

    if (model) {
      monaco.editor.setModelMarkers(model, 'yaml', markers)
    }
  }

  function handleChange(newValue: string) {
    setCode(newValue)
    const { parsedYAML, errorsYAML } = parseYAML(newValue)

    if (errorsYAML && editorRef.current && monacoRef.current) {
      const editor = editorRef.current
      const monaco = monacoRef.current
      if (schemaErrors.length > 0) {
        errorsYAML.push(...schemaErrors)
      }
      markErrors(editor, monaco, errorsYAML)
    }
  }

  function handleSave(e: any) {
    e.preventDefault()
    try {
      // parse the treamtent file, ensuring it's valid YAML
      const { parsedYAML, errorsYAML } = parseYAML(code)

      if (errorsYAML.length > 0 && editorRef.current && monacoRef.current) {
        const editor = editorRef.current
        const monaco = monacoRef.current
        if (schemaErrors.length > 0) {
          errorsYAML.push(...schemaErrors)
        }
        markErrors(editor, monaco, errorsYAML)
        console.log(errorsYAML)
        //TODO display a little something went wrong pop up
        return
      }

      // validate the treatment file against the treatment schema
      const errorsSchema = validateTreatmentSchema(parsedYAML)
      setSchemaErrors(errorsSchema)
      console.log(errorsSchema)

      if (errorsSchema.length > 0 && editorRef.current && monacoRef.current) {
        const editor = editorRef.current
        const monaco = monacoRef.current
        setSchemaErrors(errorsSchema)
        markErrors(editor, monaco, errorsSchema)
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
          }}
          onChange={(newValue: any) => handleChange(newValue)}
          onMount={(editor: null, monaco: null) => {
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
