import { useState } from 'react'
import { useSessionSummary } from '../hooks/useSessionSummary'
import { DEFAULT_REFLECTION_QUESTIONS } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download } from 'lucide-react'
import { format } from 'date-fns'

/**
 * Props for SessionSummary component
 */
interface SessionSummaryProps {
  /** Room ID */
  roomId: string
}

/**
 * Session summary component
 * 
 * Displays aggregated session data including room metadata, reflection responses,
 * and private notes. Includes PDF export functionality.
 * 
 * @param props - Component props
 */
export function SessionSummary({ roomId }: SessionSummaryProps) {
  const { summary, isLoading, error } = useSessionSummary(roomId)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    if (!summary) return

    setIsGeneratingPDF(true)
    try {
      // Lazy load PDF generator only when needed
      const { downloadPDF } = await import('../lib/pdfGenerator')
      await downloadPDF(summary)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load session summary'}
          </p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No Summary Available</h2>
          <p className="text-muted-foreground">Session data not found.</p>
        </div>
      </div>
    )
  }

  const { room, reflection, privateNotes } = summary

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Session Summary</h1>
            <p className="text-muted-foreground">
              Complete interview session details and feedback
            </p>
          </div>
          <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="gap-2">
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>Room and interview metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Room ID</p>
                <p className="text-sm">{summary.roomId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task ID</p>
                <p className="text-sm">{room.taskId || 'No task selected'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phase</p>
                <p className="text-sm capitalize">{room.phase}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(room.createdAt.toDate(), 'PPpp')}</p>
              </div>
              {room.phaseStartedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phase Started</p>
                  <p className="text-sm">{format(room.phaseStartedAt.toDate(), 'PPpp')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reflection Responses */}
        {reflection && reflection.responses.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Candidate Reflection</CardTitle>
              <CardDescription>Candidate's responses to reflection questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {reflection.responses.map((response) => {
                const question = DEFAULT_REFLECTION_QUESTIONS.find(
                  (q) => q.id === response.questionId
                )
                return (
                  <div key={response.questionId} className="space-y-2">
                    <h3 className="font-semibold">{question?.label || response.questionId}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {response.answer || 'No response'}
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Candidate Reflection</CardTitle>
              <CardDescription>No reflection responses available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The candidate has not completed the reflection form yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Private Notes */}
        {privateNotes && privateNotes.content ? (
          <Card>
            <CardHeader>
              <CardTitle>Interviewer Private Notes</CardTitle>
              <CardDescription>Private notes taken during the interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm whitespace-pre-wrap">{privateNotes.content}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Interviewer Private Notes</CardTitle>
              <CardDescription>No private notes available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No private notes were taken during this interview.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

