import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

/**
 * VSCode Dark+ inspired syntax highlighting colors
 * Based on VSCode's default dark theme color scheme
 * Colors match VSCode Dark+ theme exactly
 */
const vsCodeDarkHighlightStyle = HighlightStyle.define([
  // Keywords (const, let, function, if, etc.) - Blue in VSCode
  { tag: t.keyword, color: '#569CD6' },
  // Control flow keywords (if, else, return, etc.) - Blue
  { tag: t.controlKeyword, color: '#569CD6' },
  // Strings - Orange/peach
  { tag: t.string, color: '#CE9178' },
  // Comments - Green, italic
  { tag: t.comment, color: '#6A9955', fontStyle: 'italic' },
  // Numbers - Light green
  { tag: t.number, color: '#B5CEA8' },
  // Operators - Light gray for visibility
  { tag: t.operator, color: '#D4D4D4' },
  // Punctuation (including curly braces, brackets, etc.) - Light gray for visibility
  { tag: t.punctuation, color: '#D4D4D4' },
  // Brackets and braces - Ensure they're visible (these are typically part of punctuation)
  { tag: t.bracket, color: '#D4D4D4' },
  { tag: t.squareBracket, color: '#D4D4D4' },
  { tag: t.paren, color: '#D4D4D4' },
  { tag: t.brace, color: '#D4D4D4' },
  // Angle brackets (for generics, JSX)
  { tag: t.angleBracket, color: '#D4D4D4' },
  // Variables - Light blue
  { tag: t.variableName, color: '#9CDCFE' },
  // Function names - Yellow
  { tag: t.function(t.variableName), color: '#DCDCAA' },
  // Type names - Teal/cyan
  { tag: t.typeName, color: '#4EC9B0' },
  // Class names - Teal/cyan
  { tag: t.className, color: '#4EC9B0' },
  // Property names - Light blue
  { tag: t.propertyName, color: '#9CDCFE' },
  // Constants - Blue
  { tag: t.constant(t.variableName), color: '#569CD6' },
  // Module/namespace - Teal
  { tag: t.namespace, color: '#4EC9B0' },
  // Decorators - Purple (for TypeScript decorators)
  { tag: t.meta, color: '#C586C0' },
  // Tags (JSX/HTML) - Blue
  { tag: t.tagName, color: '#569CD6' },
  // Attributes - Light blue
  { tag: t.attributeName, color: '#92C5F7' },
  // Headings - Blue, bold
  { tag: t.heading, color: '#569CD6', fontWeight: 'bold' },
  // Emphasis - Italic
  { tag: t.emphasis, fontStyle: 'italic' },
  // Strong - Bold
  { tag: t.strong, fontWeight: 'bold' },
  // Links - Blue
  { tag: t.link, color: '#569CD6' },
  // Quotes - Green
  { tag: t.quote, color: '#6A9955' },
  // Lists - Default
  { tag: t.list, color: '#D4D4D4' },
  // Content - Default text
  { tag: t.content, color: '#D4D4D4' },
  // Boolean - Blue
  { tag: t.bool, color: '#569CD6' },
  // Null/undefined - Blue
  { tag: t.null, color: '#569CD6' },
  // Regex - Orange
  { tag: t.regexp, color: '#D16969' },
])

/**
 * Light mode syntax highlighting (subtle colors)
 */
const lightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#0000FF' },
  { tag: t.string, color: '#A31515' },
  { tag: t.comment, color: '#008000', fontStyle: 'italic' },
  { tag: t.number, color: '#098658' },
  { tag: t.operator, color: '#000000' },
  { tag: t.punctuation, color: '#000000' },
  { tag: t.variableName, color: '#001080' },
  { tag: t.function(t.variableName), color: '#795E26' },
  { tag: t.typeName, color: '#267F99' },
  { tag: t.className, color: '#267F99' },
  { tag: t.propertyName, color: '#001080' },
  { tag: t.constant(t.variableName), color: '#0000FF' },
  { tag: t.namespace, color: '#267F99' },
  { tag: t.meta, color: '#000000' },
  { tag: t.tagName, color: '#800000' },
  { tag: t.attributeName, color: '#FF0000' },
])

/**
 * Custom CodeMirror theme with VSCode Dark+ inspired styling
 * 
 * Uses oneDark theme as base for dark mode with custom syntax highlighting.
 * Supports both light and dark modes with proper syntax colors.
 */
export const codemirrorTheme = [
  // Base editor styles
  EditorView.theme(
    {
      '&': {
        fontSize: '14px',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%',
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
      '.cm-panels': {
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
  // Light mode specific styles
  EditorView.theme(
    {
      '&': {
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      },
      '.cm-content': {
        caretColor: 'var(--foreground)',
      },
      '.cm-gutters': {
        backgroundColor: '#F8F8F8',
        color: '#858585',
        border: 'none',
        borderRight: '1px solid #E8E8E8',
      },
      '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 8px',
        minWidth: '3ch',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#F0F0F0',
        color: '#000000',
      },
      '.cm-activeLine': {
        backgroundColor: '#F0F0F0',
      },
      '.cm-selectionBackground': {
        backgroundColor: '#ADD6FF',
      },
      '.cm-cursor': {
        borderLeftColor: 'var(--foreground)',
        borderLeftWidth: '2px',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#ADD6FF',
        color: '#000000',
      },
      '.cm-nonmatchingBracket': {
        backgroundColor: '#FF6B6B',
        color: '#FFFFFF',
      },
      '.cm-selectionMatch': {
        backgroundColor: '#ADD6FF',
      },
      '.cm-searchMatch': {
        backgroundColor: '#FFFF00',
        color: '#000000',
      },
      '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: '#FF6B6B',
        color: '#FFFFFF',
      },
    },
    { dark: false }
  ),
  // Dark mode custom overrides for VSCode Dark+ look
  // Note: We apply oneDark after our custom theme so our overrides take precedence
  EditorView.theme(
    {
      '&': {
        backgroundColor: '#1E1E1E', // VSCode dark background
        color: '#D4D4D4', // VSCode default text color
      },
      '.cm-content': {
        caretColor: '#AEAFAD', // VSCode cursor color
        color: '#D4D4D4', // Ensure default text color is visible
      },
      // Ensure all text elements have proper color
      '.cm-line': {
        color: '#D4D4D4',
      },
      '.cm-gutters': {
        backgroundColor: '#252526', // VSCode gutter background
        color: '#858585', // VSCode gutter text
        border: 'none',
        borderRight: '1px solid #3E3E42',
      },
      '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 8px',
        minWidth: '3ch',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#2A2D2E', // VSCode active line gutter
        color: '#FFFFFF',
      },
      '.cm-activeLine': {
        backgroundColor: '#2A2D2E', // VSCode active line background
      },
      '.cm-selectionBackground': {
        backgroundColor: '#264F78', // VSCode selection
      },
      '.cm-cursor': {
        borderLeftColor: '#AEAFAD',
        borderLeftWidth: '2px',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#0E639C', // VSCode matching bracket
        color: '#FFFFFF',
      },
      '.cm-nonmatchingBracket': {
        backgroundColor: '#F48771',
        color: '#FFFFFF',
      },
      '.cm-selectionMatch': {
        backgroundColor: '#264F78',
      },
      '.cm-searchMatch': {
        backgroundColor: '#515C6A',
        color: '#FFFFFF',
      },
      '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: '#EA5C00',
        color: '#FFFFFF',
      },
    },
    { dark: true }
  ),
  // Dark mode - use oneDark as base, but our custom theme overrides take precedence
  oneDark,
  // Syntax highlighting for light mode
  syntaxHighlighting(lightHighlightStyle, { fallback: true }),
  // Syntax highlighting for dark mode (VSCode Dark+)
  // This must come after oneDark to override its syntax highlighting
  syntaxHighlighting(vsCodeDarkHighlightStyle, { fallback: true }),
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

