'use client'
import { StageContext } from '@/editor/stageContext'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor as MonacoEditor } from 'monaco-editor'
import { useState, useEffect, useMemo, useRef } from 'react'
import languageConfig from '../config/languageConfig'

export default function CodeEditor({ language = 'yaml' }) {
  const [code, setCode] = useState('')
  const [defaultData, setDefaultData] = useState<any>(null)
  const [schemaErrors, setSchemaErrors] = useState<any>([])
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  useEffect(() => {
    async function fetchDefaultData() {
      if (defaultData) return // prevents re-fetching if defaultData is already set

      // fetch default data if loadDefaultData is defined
      const data = (await languageConfig[language].loadDefaultData?.()) || ''
      setDefaultData(data)

      // fetch local data if available
      // TODO remove hardcoded 'code' to get local edits depending on file being edited currently...
      const storedCode = localStorage.getItem('code') || ''
      setCode(storedCode || data)
    }

    fetchDefaultData()
  })

  function markErrors(errors: any[]) {
    const model = editorRef.current?.getModel()
    if (model && monacoRef.current) {
      monacoRef.current.editor.removeAllMarkers(language)

      // errors was setup to have an object stucture that corresponds to markers
      // use startColumn 1, endColumn lineLength to have the whole row(s) highlighted
      const markers = errors.map((error) => ({
        ...error,
        startColumn: 1,
        endColumn: model ? model.getLineLength(error.endLineNumber) : 1,
        severity: monacoRef.current?.MarkerSeverity.Error,
      }))
      //console.log('markers: ', markers)
      monacoRef.current.editor.setModelMarkers(model, language, markers)
    }
  }

  function handleChange(newValue: string) {
    setCode(newValue)
    const parse = languageConfig[language].parse
    const resultParse = parse(newValue)
    //console.log('change result: ', result)

    if (!resultParse.success) {
      const newErrors = resultParse.error?.issues || []
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
    const { parse, validate, save } = languageConfig[language]
    try {
      // parse the file, ensuring it's valid according to language
      const resultParse = parse(code)

      if (!resultParse.success) {
        const newErrors = resultParse?.error?.issues || []
        //console.log('new errors detected: ', newErrors)
        if (schemaErrors.length > 0) {
          // ensure that any previous schema errors are retained
          newErrors.push(...schemaErrors)
        }
        markErrors(newErrors)
        //TODO display a little something went wrong pop up
        return
      }

      // validate the file against the language schema
      const resultValidate = validate(resultParse.data)
      if (!resultValidate.success) {
        let newSchemaErrors = resultValidate?.error?.issues || []
        //console.log('new schema errors detected: ', newSchemaErrors)
        setSchemaErrors(newSchemaErrors)
        markErrors(newSchemaErrors)
        //TODO display a little something went wrong pop up
      } else {
        // data can be parsed and is valid
        setSchemaErrors([])
        save(code)
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
          language={language}
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
          onMount={(
            editor: MonacoEditor.IStandaloneCodeEditor,
            monacoInstance: Monaco
          ) => {
            editorRef.current = editor
            monacoRef.current = monacoInstance

            window.editor = editor // Expose the Monaco Editor instance for testing
          }}
        />
      </div>
      <div style={{ backgroundColor: '#F0F2F6' }}>
        <button
          data-cy="code-editor-save"
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
