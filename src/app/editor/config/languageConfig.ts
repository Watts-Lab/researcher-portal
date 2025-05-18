import { parseYAML, validateTreatmentSchema, saveYAML, loadDefaultTreatment } from "./configTreatment"

interface ParseValidateResult {
    success: boolean
    data?: any,
    error?: {
        issues: Array<{
            message: string;
            startLineNumber: number
            endLineNumber: number
            startColumn: number
            endColumn: number
        }>
    }
}

interface LanguageConfig {
    parse: (input: any) => ParseValidateResult,
    validate: (input: any) => ParseValidateResult,
    save: (input: any) => void,
    loadDefaultData?: () => Promise<any>,
}

interface CodeEditorConfig {
    [language: string]: LanguageConfig
}

const languageConfig: CodeEditorConfig = {
    yaml: {
        parse: parseYAML,
        validate: validateTreatmentSchema,
        save: saveYAML,
        loadDefaultData: loadDefaultTreatment,
    }
}

export default languageConfig