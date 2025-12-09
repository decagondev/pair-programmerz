# Active Context

## Current Work Focus
**Epic 4: Video, Voice & Presence UI - COMPLETED**
**Migration: Daily.co → Jitsi Meet - COMPLETED**

Successfully implemented complete video/voice integration with:
- Jitsi Meet React SDK integration with auto-join and video controls
- Floating draggable video tiles (Figma-style)
- Screen share functionality via Jitsi External API
- Reactions system with emoji animations (Liveblocks-based)
- Raise hand notification system (Liveblocks-based)

## Recent Changes

### Daily.co → Jitsi Meet Migration (COMPLETED)
- ✅ Removed `@daily-co/daily-js` package
- ✅ Installed `@jitsi/react-sdk` package
- ✅ Created `useJitsiCall` hook to replace `useDailyCall`
- ✅ Created `JitsiVideo` component using `JitsiMeeting` from React SDK
- ✅ Updated `VideoControls` to use Jitsi External API
- ✅ Updated `useScreenShare` to use Jitsi External API commands
- ✅ Updated `VideoGrid` to use Jitsi participant tracking
- ✅ Updated configuration: `VITE_JITSI_DOMAIN` (optional, defaults to `meet.jit.si`)
- ✅ Removed old Daily.co files and references
- ✅ All TypeScript build errors resolved
- ✅ Build passes successfully

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

### Immediate (Epic 5)
1. Timer & Phase Engine implementation
2. Phase transitions (Set Tone → Code → Reflection)
3. Big visible timer with sound alerts

## Active Decisions

### Architecture Decisions
- **Feature-sliced design** - Chosen for modularity and testability
- **Zustand + TanStack Query** - Client state vs server state separation (TanStack Query now integrated)
- **Liveblocks + Yjs** - Real-time collaboration stack
- **Jitsi Meet** - Video/voice provider via React SDK (100ms as backup, not used)
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
- Yjs document persistence strategy (currently creates new document per session)

## Context Notes
- Project follows SOLID principles throughout
- Zero circular dependencies is a hard requirement
- All code must be TypeScript strict mode compliant
- Memory Bank should be updated after significant changes

