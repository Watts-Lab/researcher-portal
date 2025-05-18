import type { editor as MonacoEditor } from 'monaco-editor';
declare global {
    interface Window {
        editor: MonacoEditor.IStandaloneCodeEditor;
    }
}

export { }