import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { yCollab } from 'y-codemirror.next'
import * as Y from 'yjs'
import { useRoom } from '@liveblocks/react'
import { getYjsDocument } from '../lib/yjs-setup'
import { codemirrorTheme, readOnlyTheme } from '../lib/codemirror-theme'

/**
 * Code editor hook
 * 
 * Initializes CodeMirror editor with Yjs binding for real-time collaboration.
 * Manages editor state (read-only, language, theme).
 * 
 * @param initialContent - Initial code content
 * @param readOnly - Whether the editor should be read-only
 * @param language - Programming language (default: 'typescript')
 * @returns Editor view instance and update functions
 */
export function useCodeEditor(
  initialContent: string = '',
  readOnly: boolean = false,
  language: 'typescript' | 'javascript' = 'typescript'
) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const yjsDocRef = useRef<Y.Doc | null>(null)
  const room = useRoom()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!editorRef.current || !room) {
      return
    }

    // Initialize Yjs document
    const yjsDoc = getYjsDocument(room)
    yjsDocRef.current = yjsDoc

    // Get Yjs text type for code content
    const yText = yjsDoc.getText('code')

    // Set initial content if provided
    if (initialContent && yText.length === 0) {
      yText.insert(0, initialContent)
    }

    // Create awareness for collaboration (cursors, selections)
    const awareness = room.getPresence()

    // Create editor state with Yjs binding
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript({ typescript: language === 'typescript', jsx: true }),
        codemirrorTheme,
        ...(readOnly ? [readOnlyTheme, EditorState.readOnly.of(true)] : []),
        yCollab(yText, awareness),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            // Content changed - Yjs will handle synchronization
          }
        }),
      ],
    })

    // Create editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view
    setIsReady(true)

    // Cleanup
    return () => {
      view.destroy()
      yjsDoc.destroy()
      setIsReady(false)
    }
  }, [room, initialContent, readOnly, language])

  /**
   * Update editor content
   */
  const setContent = (content: string) => {
    if (!yjsDocRef.current) {
      return
    }

    const yText = yjsDocRef.current.getText('code')
    const currentContent = yText.toString()

    if (currentContent !== content) {
      yText.delete(0, yText.length)
      yText.insert(0, content)
    }
  }

  /**
   * Get current editor content
   */
  const getContent = (): string => {
    if (!yjsDocRef.current) {
      return ''
    }

    return yjsDocRef.current.getText('code').toString()
  }

  return {
    editorRef,
    view: viewRef.current,
    isReady,
    setContent,
    getContent,
  }
}

