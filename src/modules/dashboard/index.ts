/**
 * Dashboard module
 * 
 * This module handles the interviewer dashboard and room list.
 * 
 * @module dashboard
 */

export { DashboardLayout } from './components/DashboardLayout'
export { RoomList } from './components/RoomList'
export { RoomCard } from './components/RoomCard'
export { CreateRoomDialog } from './components/CreateRoomDialog'
export { CreateRoomForm } from './components/CreateRoomForm'

export { useRooms } from './hooks/useRooms'
export { useCreateRoom } from './hooks/useCreateRoom'
export { useTasks } from './hooks/useTasks'

export type { RoomStatusFilter } from './types'
