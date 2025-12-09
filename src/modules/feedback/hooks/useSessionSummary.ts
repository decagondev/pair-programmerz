import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRoom } from '@/modules/room'
import { getReflection } from '@/lib/firebase/reflections'
import { getPrivateNotes } from '@/lib/firebase/privateNotes'
import type { SessionSummaryData } from '../types'

/**
 * Hook for session summary data
 * 
 * Aggregates room data, reflection responses, and private notes for the summary page.
 * 
 * @param roomId - Room ID
 * @returns Session summary data, loading state, and error
 */
export function useSessionSummary(roomId: string) {
  const { data: room, isLoading: roomLoading, error: roomError } = useRoom(roomId)

  // Get all participants (candidates) for reflection lookup
  const candidateIds = useMemo(() => {
    if (!room) return []
    // Participants are candidates (excluding creator who is interviewer)
    return room.participants.filter((id) => id !== room.createdBy)
  }, [room])

  // Get reflection for first candidate (assuming single candidate per room for now)
  const candidateId = candidateIds[0] || null

  const { data: reflection, isLoading: reflectionLoading } = useQuery({
    queryKey: ['reflection', roomId, candidateId],
    queryFn: async () => {
      if (!roomId || !candidateId) return null
      return await getReflection(roomId, candidateId)
    },
    enabled: !!roomId && !!candidateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get private notes for interviewer
  const interviewerId = room?.createdBy || null

  const { data: privateNotes, isLoading: notesLoading } = useQuery({
    queryKey: ['privateNotes', roomId, interviewerId],
    queryFn: async () => {
      if (!roomId || !interviewerId) return null
      return await getPrivateNotes(roomId, interviewerId)
    },
    enabled: !!roomId && !!interviewerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Aggregate summary data
  const summary: SessionSummaryData | null = useMemo(() => {
    if (!room) return null

    return {
      roomId,
      room: {
        taskId: room.taskId,
        createdBy: room.createdBy,
        participants: room.participants,
        phase: room.phase,
        createdAt: room.createdAt,
        phaseStartedAt: room.phaseStartedAt,
      },
      reflection: reflection || null,
      privateNotes: privateNotes || null,
    }
  }, [roomId, room, reflection, privateNotes])

  const isLoading = roomLoading || reflectionLoading || notesLoading
  const error = roomError

  return {
    summary,
    isLoading,
    error,
  }
}

