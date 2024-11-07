import { treatmentFileSchema } from '../../../../deliberation-empirica/server/src/preFlight/validateTreatmentFile'
import { parse, stringify } from 'yaml'
import { ZodIssue, ZodError } from 'zod'
import yaml from 'js-yaml'

export function parseYAML(yamlString: string) {
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

export function validateTreatmentSchema(parsedYAML: any[]) {
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
            return { success: false, error: { issues: formatZodIssues(result.error.issues) } }
        } else {
            return { success: true, data: result.data }
        }
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
            message: `${location}: ${details}`,
            startLineNumber: 1,
            endLineNumber: 1,
            startColumn: 1,
            endColumn: 1,
            path: location,
        }
    })
}

// TODO remove hardcoded 'code' to get local edits depending on file being edited currently...
export function saveYAML(yamlData: string, key: string = "code") {
    try {
        localStorage.setItem(key, yamlData)
        console.log('Yaml data saved to local storage with key: ${key}')
        window.location.reload() //refresh page to make elements appear on screen
    } catch (error) {
        console.error("Failed to save YAML:", error)
    }
}

export async function loadDefaultTreatment() {
    const response = await fetch('/defaultTreatment.yaml')
    const text = await response.text()
    return stringify(yaml.load(text))
}