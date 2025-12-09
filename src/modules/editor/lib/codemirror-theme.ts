import { EditorView } from '@codemirror/view'

/**
 * Custom CodeMirror theme matching shadcn/ui design system
 * 
 * Uses CSS variables from Tailwind/shadcn theme for consistent styling.
 * Supports both light and dark modes.
 */
export const codemirrorTheme = [
  EditorView.theme(
    {
      '&': {
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        fontSize: '14px',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%',
        caretColor: 'var(--foreground)',
      },
      '.cm-focused': {
        outline: 'none',
      },
      '.cm-editor': {
        height: '100%',
      },
      '.cm-scroller': {
        fontFamily: 'inherit',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--muted)',
        color: 'var(--muted-foreground)',
        border: 'none',
        borderRight: '1px solid var(--border)',
      },
      '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 8px',
        minWidth: '3ch',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--muted)',
        color: 'var(--foreground)',
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--muted)',
      },
      '.cm-selectionBackground': {
        backgroundColor: 'var(--accent)',
      },
      '.cm-cursor': {
        borderLeftColor: 'var(--foreground)',
        borderLeftWidth: '2px',
      },
      '.cm-matchingBracket': {
        backgroundColor: 'var(--accent)',
        color: 'var(--accent-foreground)',
      },
      '.cm-nonmatchingBracket': {
        backgroundColor: 'var(--destructive)',
        color: 'var(--primary-foreground)',
      },
      '.cm-selectionMatch': {
        backgroundColor: 'var(--accent)',
      },
      '.cm-searchMatch': {
        backgroundColor: 'var(--accent)',
        color: 'var(--accent-foreground)',
      },
      '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
      },
      '.cm-panels': {
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
      },
      '.cm-panels.cm-panels-top': {
        borderBottom: '1px solid var(--border)',
      },
      '.cm-panels.cm-panels-bottom': {
        borderTop: '1px solid var(--border)',
      },
      '.cm-button': {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        border: '1px solid var(--border)',
      },
      '.cm-button:hover': {
        backgroundColor: 'var(--primary)',
        opacity: 0.9,
      },
      '.cm-textfield': {
        backgroundColor: 'var(--input)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
      },
      '.cm-textfield:focus': {
        borderColor: 'var(--ring)',
        outline: 'none',
      },
    },
    { dark: false }
  ),
  // Dark mode theme
  EditorView.theme(
    {
      '&': {
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--muted)',
        color: 'var(--muted-foreground)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--muted)',
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--muted)',
      },
    },
    { dark: true }
  ),
  // Use oneDark as base for dark mode syntax highlighting
  EditorView.theme(
    {
      '&.cm-focused': {
        outline: 'none',
      },
    },
    { dark: true }
  ),
]

/**
 * Read-only theme extension
 * 
 * Styles the editor when in read-only mode
 */
export const readOnlyTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--muted)',
    opacity: 0.8,
  },
  '.cm-content': {
    cursor: 'not-allowed',
  },
})

