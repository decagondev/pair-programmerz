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
- **Firebase Auth** - Anonymous + Email magic links
- **Custom tokens** - Cloud Functions for role-based access
- **Firestore security rules** - Enforce access control

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
1. Interviewer creates room → Firestore `rooms/{id}` created
2. Magic link generated → Cloud Function creates token
3. Candidate joins → Validates token → Signs in → Joins Liveblocks room
4. Phase transitions → Firestore `phase` field updated
5. Session ends → Summary generated → Data persisted

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

## Testing Strategy (Future)
- Unit tests for hooks and utilities
- Integration tests for module interactions
- E2E tests for critical flows (room creation, code sync)
- Firebase emulator for Firestore rules testing

