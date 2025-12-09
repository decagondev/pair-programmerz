/**
 * Room module
 * 
 * This module handles room creation, management, and lifecycle.
 * 
 * @module room
 */

export type {
  RoomDocument,
  RoomDocumentWithId,
  CreateRoomInput,
  UpdateRoomInput,
  RoomPhase,
  RoomStatus,
} from './types'

export { useRoom } from './hooks/useRoom'
