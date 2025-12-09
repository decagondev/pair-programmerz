# System Patterns & Architecture

## Architecture Overview

### Feature-Sliced Design
The codebase follows **feature-sliced design** where each feature is a self-contained module:

```
src/modules/
  auth/          # Authentication & authorization
  room/          # Room management & lifecycle
  editor/        # Collaborative code editor
  video/         # Video/voice integration
  timer/         # Phase & timer management
  task/          # Task library & CRUD
  feedback/      # Reflection & notes
  dashboard/     # Interviewer dashboard
  config/        # Global configuration
  store/         # State management
  ui/            # Shared UI components
```

### Module Structure
Each module owns:
- **Types** - TypeScript interfaces and types
- **Hooks** - Custom React hooks
- **Components** - React components
- **Store slice** - Zustand state (if needed)
- **Firebase rules snippet** - Security rules (if needed)
- **index.ts** - Barrel export (public API only)

## Design Patterns

### SOLID Principles

#### Single Responsibility Principle (SRP)
- Each module handles one feature domain
- Components have one job
- Hooks are focused on specific concerns
- Store slices are feature-specific

#### Open/Closed Principle (OCP)
- Barrel exports allow extension without modification
- Module boundaries prevent tight coupling
- Interfaces defined in `src/types/` for contracts

#### Liskov Substitution Principle (LSP)
- Components accept interfaces, not concrete implementations
- Hooks return consistent interfaces
- Store slices follow common patterns

#### Interface Segregation Principle (ISP)
- Hooks expose only needed functionality
- Store slices are minimal and focused
- Components receive only required props

#### Dependency Inversion Principle (DIP)
- Modules depend on abstractions (types/interfaces)
- Firebase/Liveblocks/Daily accessed through `lib/` wrappers
- Config modules provide initialized clients, not raw configs

## Key Technical Decisions

### State Management
- **Zustand** - Client-side state (user preferences, UI state)
- **TanStack Query** - Server state (Firestore queries, mutations)
- **Liveblocks** - Real-time collaborative state (presence, storage)
- **Firestore** - Persistent data (rooms, tasks, notes)

### Real-Time Collaboration
- **Liveblocks** - Primary real-time engine (presence, storage)
  - Room provider wraps editor components
  - Presence tracks user cursors, names, roles
  - Storage holds driver ID and file contents
- **Yjs** - CRDT for code synchronization (via Liveblocks)
  - Yjs documents bound to Liveblocks storage
  - CodeMirror binds to Yjs text type
  - Real-time synchronization across all clients
- **CodeMirror 6** - Editor with Yjs binding
  - Custom theme matching shadcn/ui design system
  - Read-only mode when user is not driver
  - TypeScript/JavaScript language support

### Authentication
- **Firebase Auth** - Anonymous authentication
  - Anonymous sign-in on app load (automatic)
  - Magic link tokens generated server-side via Cloud Function (not Firebase's built-in email auth)
  - Custom tokens via Cloud Functions (placeholder for generateMagicLink)
  - Note: `sendPasswordlessEmail` doesn't exist in Firebase Auth - magic links are generated server-side
- **Protected Routes** - RequireAuth and RequireRole components
- **Role Detection** - useRole hook queries Firestore room documents
- **Auth State** - Synced between Firebase Auth and Zustand store
- **Firestore security rules** - Enforce access control (Epic 2 ✅)
  - Rooms collection: Only participants can read, only creator can create/update/delete
  - Participant access: Users in `createdBy` or `participants` array can read

### Video/Voice
- **Jitsi Meet** - Primary video/voice provider (integrated)
  - React SDK with `JitsiMeeting` component
  - External API for programmatic control
  - Auto-join on room entry
  - Native screen share support via External API
  - Participant tracking via `getParticipantsInfo()`
  - Domain: `meet.jit.si` (default) or custom domain via `VITE_JITSI_DOMAIN`
- **100ms** - Backup option if needed (not currently used)
- **Video Module Structure**:
  - `useJitsiCall` - Call lifecycle management with External API
  - `JitsiVideo` - Main video component using JitsiMeeting
  - `useDraggable` - Drag functionality for video tiles
  - `useScreenShare` - Screen share management via Jitsi External API
  - `useReactions` - Reactions state (Liveblocks storage, independent of video provider)
  - `useRaiseHand` - Raise hand state (Liveblocks storage, independent of video provider)
- **Floating Video Tiles** - Figma-style draggable tiles
- **Reactions** - Emoji animations with Liveblocks sync
- **Raise Hand** - Notification system with sound alerts
- **Migration**: Migrated from Daily.co to Jitsi Meet React SDK (Dec 2025)

## Component Patterns

### Barrel Exports
Every module exports via `index.ts`:
```typescript
// src/modules/auth/index.ts
export { useAuth } from './hooks/useAuth'
export type { User } from './types'
// Internal implementation not exported
```

### Custom Hooks Pattern
```typescript
// src/hooks/useRoom.ts
export function useRoom(roomId: string) {
  // Encapsulates Firebase + Liveblocks logic
  // Returns clean interface
}
```

### Store Slice Pattern
```typescript
// src/modules/store/slices/userStore.ts
export const useUserStore = create<UserSlice>()((set) => ({
  // Feature-specific state
}))
```

## Data Flow

### Room Lifecycle
1. Interviewer creates room → Firestore `rooms/{id}` created (Epic 2 ✅)
2. Magic link generated → Client-side token generation (placeholder, Cloud Function in deployment)
3. Candidate joins → Validates token → Signs in → Redirects to room (Epic 1 ✅)
4. Phase transitions → Firestore `phase` and `phaseStartedAt` fields updated (Epic 5 ✅)
5. Timer counts down → Auto-advance via Cloud Function or manual advance by interviewer (Epic 5 ✅)
6. Session ends → Summary generated → Data persisted (Epic 6)

### Authentication Flow
1. App loads → useAuth hook initializes → Anonymous sign-in if not authenticated
2. User state synced to Zustand store (user ID, email, role, displayName)
3. Protected routes check auth via RequireAuth component
4. Role-based routes check role via RequireRole component (queries Firestore)
5. Magic link flow: `/join/:token` → Validate token → Sign in → Redirect to room
   - Magic links are generated server-side via Cloud Function (not Firebase's built-in email auth)
   - Token validation happens client-side, actual sign-in will use Cloud Function to exchange token

### Real-Time Sync
1. Code changes → Yjs document updated
2. Yjs → Liveblocks storage sync (via LiveblocksYjsProvider)
3. Liveblocks → All connected clients receive update
4. CodeMirror → Renders changes

### Editor Patterns

#### Driver/Navigator Pattern
- Driver ID stored in Liveblocks storage: `storage.driverId` (string | null)
- Only driver can edit code (read-only mode for navigators)
- Interviewer can always take control
- Visual indicator shows current driver status

#### File Management Pattern
- Files stored in Liveblocks storage: `storage.files` (Record<string, string>)
- Active file stored in: `storage.activeFile` (string | null)
- Starter code loaded from task when room phase changes to 'coding'
- File tree component allows switching between files

#### Editor Module Structure
```
src/modules/editor/
  components/
    LiveblocksRoomProvider.tsx  # Liveblocks room context provider
    PresenceIndicator.tsx        # Avatar stack showing connected users
    CodeEditor.tsx              # Main CodeMirror 6 editor component
    DriverIndicator.tsx         # Banner showing driver status
    DriverControls.tsx          # Buttons for driver control
    FileTree.tsx                # File tree sidebar
    EditorLayout.tsx            # Main layout combining all components
  hooks/
    usePresence.ts              # Presence management hook
    useCodeEditor.ts             # CodeMirror editor hook
    useDriver.ts                 # Driver/navigator management hook
    useFileTree.ts               # File tree management hook
  lib/
    codemirror-theme.ts          # Custom CodeMirror theme
    yjs-setup.ts                 # Yjs document initialization
    starter-code-loader.ts       # Starter code parsing utility
  types.ts                       # Editor type definitions
  index.ts                       # Barrel exports
```

## Module Boundaries

### No Circular Dependencies
- Modules only import from `lib/`, `hooks/`, `types/`
- Modules don't import from other modules directly
- Shared code lives in `lib/` or `hooks/`

### Dependency Graph
```
modules/ → lib/ → external packages
modules/ → hooks/ → lib/
modules/ → types/ → (no dependencies)
```

## Authentication Patterns

### Auth Module Structure
```
src/modules/auth/
  hooks/
    useAuth.ts          # Main auth hook (Firebase auth state)
    useMagicLink.ts      # Magic link validation and sign-in
    useRole.ts           # Role detection from Firestore
  components/
    JoinPage.tsx         # Magic link join page
    RequireAuth.tsx      # Route protection component
    RequireRole.tsx      # Role-based route protection
    AuthProvider.tsx     # App-wide auth initialization
  types.ts               # Auth types (AuthUser, AuthState, etc.)
  index.ts               # Barrel exports
```

### Protected Route Pattern
```typescript
<RequireAuth>
  <RequireRole requiredRole="interviewer">
    <DashboardPage />
  </RequireRole>
</RequireAuth>
```

### Role Detection Pattern
- useRole hook queries Firestore `rooms/{roomId}` document
- Checks `createdBy` field for interviewer role
- Checks `participants` array for candidate role
- Caches role in component state (not in Zustand to avoid circular deps)

## Room Management Patterns

### Room Module Structure
```
src/modules/room/
  hooks/
    useRoom.ts          # Single room query with real-time subscription
  types.ts              # Room types (RoomDocument, RoomPhase, RoomStatus)
  index.ts              # Barrel exports
```

### Dashboard Module Structure
```
src/modules/dashboard/
  components/
    DashboardLayout.tsx  # Main dashboard page
    RoomList.tsx         # Room list with filtering
    RoomCard.tsx         # Individual room card
    CreateRoomDialog.tsx # Room creation modal
    CreateRoomForm.tsx   # Room creation form
  hooks/
    useRooms.ts          # Rooms list query with real-time subscription
    useCreateRoom.ts     # Room creation mutation
    useTasks.ts          # Tasks query (sampleTasks for now)
  types.ts               # Dashboard types
  index.ts               # Barrel exports
```

### Real-Time Subscription Pattern
```typescript
// useRooms hook pattern
export function useRooms() {
  const [rooms, setRooms] = useState<RoomDocumentWithId[]>([])
  
  useEffect(() => {
    const unsubscribe = subscribeToUserRooms(userId, (updatedRooms) => {
      setRooms(updatedRooms)
      queryClient.setQueryData(['rooms', userId], updatedRooms)
    })
    return () => unsubscribe()
  }, [userId, queryClient])
  
  // Use TanStack Query for loading/error states
  const query = useQuery({ queryKey: ['rooms', userId], ... })
  return { ...query, data: rooms }
}
```

### Room Document Schema
```typescript
interface RoomDocument {
  createdBy: string              // Interviewer UID
  participants: string[]         // Array of participant UIDs
  taskId: string | null          // Selected task ID
  phase: 'waiting' | 'tone' | 'coding' | 'reflection' | 'ended'
  status: 'active' | 'finished' // Computed from phase
  createdAt: Timestamp
  updatedAt: Timestamp
  magicLinkToken?: string        // Generated token
  magicLinkExpiresAt?: Timestamp // Token expiration
  phaseStartedAt?: Timestamp     // When current phase started (for timer calculations)
}
```

### Timer & Phase Management Patterns (Epic 5 ✅)

#### Phase Management
- **Single source of truth**: Phase stored in Firestore `rooms/{id}.phase`
- **Phase durations**: Tone (5 min), Coding (45 min), Reflection (10 min)
- **Phase transitions**: Manual (interviewer) or automatic (Cloud Function)
- **Phase validation**: Cannot skip phases or go backwards (except to 'ended')
- **Phase timestamps**: `phaseStartedAt` tracks when current phase started for timer calculations

#### Timer Calculation
- **Server timestamp-based**: Uses `phaseStartedAt` from Firestore to handle clock skew
- **Real-time updates**: Timer updates every second via `useTimer` hook
- **Visual states**: Green (> 5 min), Yellow (< 5 min), Red (< 2 min)
- **Sound alerts**: Subtle chimes at 5 min, 2 min, and 0 min remaining

#### Phase-Specific UI Locking
- **Tone phase**: Show task overview, allow video/voice setup, hide editor
- **Coding phase**: Show full editor, enable driver/navigator switching
- **Reflection phase**: Hide editor, show reflection form (Epic 6), disable driver switching
- **Ended phase**: Show summary page, disable all editing

#### Timer Module Structure
```
src/modules/timer/
  components/
    TimerDisplay.tsx        # Big visible countdown timer
    PhaseControls.tsx        # Interviewer phase advance buttons
    PhaseLock.tsx            # Phase-based conditional rendering wrapper
  hooks/
    useTimer.ts             # Timer state and calculations
    usePhase.ts             # Phase state management
    usePhaseTransition.ts   # Phase transition mutations
    usePhaseLock.ts         # Phase-based UI restrictions
  lib/
    timerUtils.ts           # Timer calculation utilities
    soundAlerts.ts          # Sound alert utilities (Web Audio API)
  types.ts                   # Timer and phase types
  index.ts                   # Barrel exports
```

#### Cloud Function Pattern
- **Scheduled function**: `checkPhaseTransitions` runs every minute
- **Auto-advance**: Checks all active rooms and advances phase when duration expires
- **Server-side validation**: Ensures phase transitions follow correct sequence

### Feedback & Reflection Patterns (Epic 6 ✅)

#### Feedback Module Structure
```
src/modules/feedback/
  components/
    ReflectionForm.tsx        # Candidate reflection form
    PrivateNotes.tsx           # Interviewer private notes editor
    SessionSummary.tsx          # Session summary page
  hooks/
    useReflection.ts           # Reflection data hook
    usePrivateNotes.ts         # Private notes data hook
    useSessionSummary.ts       # Summary aggregation hook
  lib/
    pdfGenerator.tsx           # PDF generation utility
  types.ts                     # Feedback type definitions
  index.ts                     # Barrel exports
```

#### Firestore Subcollection Pattern
- **Reflections**: `rooms/{roomId}/reflections/{userId}`
  - Candidates write their own reflection
  - Both participants can read
  - Auto-save with debouncing (500ms)
  - Real-time subscriptions via Firestore onSnapshot
- **Private Notes**: `rooms/{roomId}/privateNotes/{userId}`
  - Only interviewer (creator) can read/write
  - Auto-save with debouncing (500ms)
  - Real-time subscriptions via Firestore onSnapshot

#### Reflection Form Pattern
- **Phase-aware**: Only shown during 'reflection' phase (via `usePhaseLock`)
- **Auto-save**: Debounced save (500ms) on typing + immediate save on blur
- **Validation**: Zod schema with react-hook-form
- **Questions**: Configurable via `DEFAULT_REFLECTION_QUESTIONS` (5 questions)
- **Real-time sync**: Firestore subscriptions with TanStack Query cache updates

#### Private Notes Pattern
- **Role-based**: Visible only to interviewers (via `useRole` hook)
- **Always available**: Not locked to any specific phase
- **Auto-save**: Debounced save (500ms) on typing + immediate save on blur
- **Simple editor**: Textarea component (can be upgraded to TipTap in future)

#### Session Summary Pattern
- **Aggregation**: Combines room data, reflection responses, and private notes
- **PDF export**: Uses `@react-pdf/renderer` for downloadable PDFs
- **Route**: `/room/:roomId/summary` (accessible when phase is 'ended')
- **Access control**: Both candidate and interviewer can view summary

#### Auto-Save Pattern
- **Debouncing**: 500ms delay to reduce Firestore writes
- **Immediate save**: On field blur for better UX
- **Optimistic updates**: TanStack Query cache updates on subscription
- **Error handling**: Console errors, user can manually retry

## Testing Strategy (Future)
- Unit tests for hooks and utilities
- Integration tests for module interactions
- E2E tests for critical flows (room creation, code sync, auth flow)
- Firebase emulator for Firestore rules testing
- Auth flow testing (anonymous sign-in, magic link validation)
- Room creation and management flow testing

