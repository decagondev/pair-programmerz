import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { SessionSummaryData } from '../types'
import { DEFAULT_REFLECTION_QUESTIONS } from '../types'
import { format } from 'date-fns'

/**
 * PDF styles
 */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottom: '1pt solid #000',
    paddingBottom: 5,
  },
  text: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  question: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  answer: {
    marginBottom: 10,
    paddingLeft: 10,
    lineHeight: 1.5,
  },
  notes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    lineHeight: 1.5,
  },
})

/**
 * PDF document component
 */
function SessionSummaryPDF({ summary }: { summary: SessionSummaryData }) {
  const { room, reflection, privateNotes } = summary

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Interview Session Summary</Text>

        {/* Room Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Room ID: </Text>
            {summary.roomId}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Task ID: </Text>
            {room.taskId || 'No task selected'}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Phase: </Text>
            {room.phase}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Created: </Text>
            {format(room.createdAt.toDate(), 'PPpp')}
          </Text>
          {room.phaseStartedAt && (
            <Text style={styles.text}>
              <Text style={styles.label}>Phase Started: </Text>
              {format(room.phaseStartedAt.toDate(), 'PPpp')}
            </Text>
          )}
        </View>

        {/* Reflection Responses */}
        {reflection && reflection.responses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Candidate Reflection</Text>
            {reflection.responses.map((response) => {
              const question = DEFAULT_REFLECTION_QUESTIONS.find(
                (q) => q.id === response.questionId
              )
              return (
                <View key={response.questionId} style={{ marginBottom: 10 }}>
                  <Text style={styles.question}>
                    {question?.label || response.questionId}
                  </Text>
                  <Text style={styles.answer}>{response.answer || 'No response'}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* Private Notes */}
        {privateNotes && privateNotes.content && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interviewer Private Notes</Text>
            <Text style={styles.notes}>{privateNotes.content}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

/**
 * Generate PDF blob from session summary
 * 
 * @param summary - Session summary data
 * @returns Promise that resolves to PDF blob
 */
export async function generatePDF(summary: SessionSummaryData): Promise<Blob> {
  const doc = <SessionSummaryPDF summary={summary} />
  const blob = await pdf(doc).toBlob()
  return blob
}

/**
 * Download PDF file
 * 
 * @param summary - Session summary data
 * @param filename - Optional filename (defaults to session summary with timestamp)
 */
export async function downloadPDF(
  summary: SessionSummaryData,
  filename?: string
): Promise<void> {
  const blob = await generatePDF(summary)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `session-summary-${summary.roomId}-${Date.now()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

