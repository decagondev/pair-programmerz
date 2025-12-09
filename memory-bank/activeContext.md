# Active Context

## Current Work Focus
**Epic 2: Room Creation & Management - COMPLETED**

Successfully implemented complete room management system with:
- Interviewer dashboard with real-time room list
- Room creation wizard with task selection
- Firestore room model with security rules
- TanStack Query integration for server state
- Magic link generation for candidate invites

## Recent Changes

### Epic 2 Progress (COMPLETED)
- ✅ TanStack Query installed and configured with QueryClientProvider
- ✅ Complete room type definitions (RoomDocument, RoomPhase, RoomStatus)
- ✅ Firebase rooms library with CRUD operations and real-time subscriptions
- ✅ Magic link token generation utility (client-side placeholder)
- ✅ Dashboard layout component with header and room list
- ✅ Real-time room list with status filtering (useRooms hook)
- ✅ Room card component with status badges and metadata
- ✅ Create room dialog and form with task selector
- ✅ Room creation mutation hook with redirect on success
- ✅ Sample tasks data (6 real production tasks)
- ✅ Firestore security rules for rooms collection
- ✅ Updated App.tsx to use DashboardLayout
- ✅ useRoom hook for single room queries with real-time updates

## Next Steps

### Immediate (Epic 3)
1. Liveblocks integration and room provider
2. CodeMirror 6 setup with Yjs binding
3. Driver/Navigator role switching
4. File tree and starter code loading

## Active Decisions

### Architecture Decisions
- **Feature-sliced design** - Chosen for modularity and testability
- **Zustand + TanStack Query** - Client state vs server state separation (TanStack Query now integrated)
- **Liveblocks + Yjs** - Real-time collaboration stack
- **Daily.co** - Video/voice provider (100ms as backup)
- **Real-time subscriptions** - Firestore onSnapshot with TanStack Query cache updates

### Development Decisions
- **TypeScript strict mode** - Enforced from day one
- **Barrel exports** - All modules export via `index.ts`
- **Absolute imports** - Use `@/` path alias, no relative imports going up
- **Cursor IDE** - Single source of truth for project knowledge

## Considerations

### Technical Debt
- None yet (project just starting)

### Known Issues
- None - all TypeScript build errors resolved
- Magic link token generation is client-side placeholder (Cloud Function will handle in deployment)

### Questions to Resolve
- Cloud Function implementation for magic link token generation (deferred to deployment phase)
- Liveblocks room configuration (when Epic 3 starts)
- Daily.co account setup (when Epic 4 starts)

## Context Notes
- Project follows SOLID principles throughout
- Zero circular dependencies is a hard requirement
- All code must be TypeScript strict mode compliant
- Memory Bank should be updated after significant changes

