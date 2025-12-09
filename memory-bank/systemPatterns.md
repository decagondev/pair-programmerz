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
- **Yjs** - CRDT for code synchronization (via Liveblocks)
- **CodeMirror 6** - Editor with Yjs binding

### Authentication
- **Firebase Auth** - Anonymous authentication
  - Anonymous sign-in on app load (automatic)
  - Magic link tokens generated server-side via Cloud Function (not Firebase's built-in email auth)
  - Custom tokens via Cloud Functions (placeholder for generateMagicLink)
  - Note: `sendPasswordlessEmail` doesn't exist in Firebase Auth - magic links are generated server-side
- **Protected Routes** - RequireAuth and RequireRole components
- **Role Detection** - useRole hook queries Firestore room documents
- **Auth State** - Synced between Firebase Auth and Zustand store
- **Firestore security rules** - Enforce access control (to be implemented in Epic 2)

### Video/Voice
- **Daily.co** - Primary video/voice provider
- **100ms** - Backup option if needed
- **Prebuilt embed** - Fast integration, native features

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
1. Interviewer creates room → Firestore `rooms/{id}` created (Epic 2)
2. Magic link generated → Cloud Function creates token (placeholder in Epic 1)
3. Candidate joins → Validates token → Signs in → Redirects to room (Epic 1 ✅)
4. Phase transitions → Firestore `phase` field updated (Epic 5)
5. Session ends → Summary generated → Data persisted (Epic 6)

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
2. Yjs → Liveblocks storage sync
3. Liveblocks → All connected clients receive update
4. CodeMirror → Renders changes

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

## Testing Strategy (Future)
- Unit tests for hooks and utilities
- Integration tests for module interactions
- E2E tests for critical flows (room creation, code sync, auth flow)
- Firebase emulator for Firestore rules testing
- Auth flow testing (anonymous sign-in, magic link validation)

