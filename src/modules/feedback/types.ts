import type { Timestamp } from 'firebase/firestore'

/**
 * Reflection question configuration
 * 
 * Defines a single reflection question.
 */
export interface ReflectionQuestion {
  /** Unique identifier for the question */
  id: string
  /** Question text */
  label: string
  /** Placeholder text for the input */
  placeholder: string
}

/**
 * Reflection response
 * 
 * A candidate's response to a reflection question.
 */
export interface ReflectionResponse {
  /** Question ID */
  questionId: string
  /** Response text */
  answer: string
}

/**
 * Reflection document
 * 
 * Represents a reflection document in Firestore.
 * Stored in `rooms/{roomId}/reflections/{userId}`.
 */
export interface ReflectionDocument {
  /** User ID who submitted the reflection */
  userId: string
  /** Room ID */
  roomId: string
  /** Array of question responses */
  responses: ReflectionResponse[]
  /** Timestamp when reflection was created */
  createdAt: Timestamp
  /** Timestamp when reflection was last updated */
  updatedAt: Timestamp
}

/**
 * Reflection document with ID
 * 
 * Reflection document including the document ID.
 */
export interface ReflectionDocumentWithId extends ReflectionDocument {
  id: string
}

/**
 * Create reflection input
 * 
 * Data required to create or update a reflection.
 */
export interface CreateReflectionInput {
  /** Array of question responses */
  responses: ReflectionResponse[]
}

/**
 * Private notes document
 * 
 * Represents private notes document in Firestore.
 * Stored in `rooms/{roomId}/privateNotes/{userId}`.
 */
export interface PrivateNotesDocument {
  /** User ID who owns the notes (interviewer) */
  userId: string
  /** Room ID */
  roomId: string
  /** Notes content (plain text for now, can be upgraded to rich text) */
  content: string
  /** Timestamp when notes were created */
  createdAt: Timestamp
  /** Timestamp when notes were last updated */
  updatedAt: Timestamp
}

/**
 * Private notes document with ID
 * 
 * Private notes document including the document ID.
 */
export interface PrivateNotesDocumentWithId extends PrivateNotesDocument {
  id: string
}

/**
 * Create private notes input
 * 
 * Data required to create or update private notes.
 */
export interface CreatePrivateNotesInput {
  /** Notes content */
  content: string
}

/**
 * Session summary data
 * 
 * Aggregated data for session summary page.
 */
export interface SessionSummaryData {
  /** Room ID */
  roomId: string
  /** Room metadata */
  room: {
    taskId: string | null
    createdBy: string
    participants: string[]
    phase: string
    createdAt: Timestamp
    phaseStartedAt?: Timestamp
  }
  /** Candidate reflection responses */
  reflection: ReflectionDocumentWithId | null
  /** Interviewer private notes */
  privateNotes: PrivateNotesDocumentWithId | null
}

/**
 * Default reflection questions
 * 
 * Standard set of reflection questions for all interviews.
 */
export const DEFAULT_REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: 'approach',
    label: 'What was your approach to solving this problem?',
    placeholder: 'Describe your thought process and strategy...',
  },
  {
    id: 'improvements',
    label: 'What would you improve if this code went to production?',
    placeholder: 'Consider performance, security, maintainability, testing...',
  },
  {
    id: 'challenges',
    label: 'What challenges did you face, and how did you overcome them?',
    placeholder: 'Share any obstacles you encountered and your solutions...',
  },
  {
    id: 'different',
    label: 'What would you do differently next time?',
    placeholder: 'Reflect on what you learned and how you would approach it differently...',
  },
  {
    id: 'additional',
    label: 'Any additional thoughts or feedback?',
    placeholder: 'Anything else you would like to share...',
  },
]

