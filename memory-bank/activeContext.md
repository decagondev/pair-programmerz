# Active Context

## Current Work Focus
**Epic 0: Project Memory Bank & Foundation Setup**

Establishing the foundational architecture, documentation, and development standards for PairCode. This includes:
- Memory Bank documentation (this file and others)
- Cursor rules for development patterns
- SOLID-compliant folder structure
- Global configuration modules
- State management foundation

## Recent Changes

### Epic 0 Progress
- ✅ Memory Bank structure created
- 🔄 Cursor rules creation (in progress)
- ⏳ Folder structure setup (pending)
- ⏳ Config modules (pending)
- ⏳ Store foundation (pending)

## Next Steps

### Immediate (Epic 0)
1. Complete Cursor rules (15+ rule files)
2. Create modular folder structure (`src/modules/`, `src/hooks/`, `src/types/`)
3. Set up ESLint with import sorting
4. Create config modules (env, firebase, liveblocks, daily)
5. Set up Zustand store foundation

### Upcoming (Epic 1)
- Firebase Auth setup
- Magic link generation
- Protected routes

## Active Decisions

### Architecture Decisions
- **Feature-sliced design** - Chosen for modularity and testability
- **Zustand + TanStack Query** - Client state vs server state separation
- **Liveblocks + Yjs** - Real-time collaboration stack
- **Daily.co** - Video/voice provider (100ms as backup)

### Development Decisions
- **TypeScript strict mode** - Enforced from day one
- **Barrel exports** - All modules export via `index.ts`
- **Absolute imports** - Use `@/` path alias, no relative imports going up
- **Cursor IDE** - Single source of truth for project knowledge

## Considerations

### Technical Debt
- None yet (project just starting)

### Known Issues
- None yet

### Questions to Resolve
- Firebase project setup (when Epic 1 starts)
- Liveblocks room configuration (when Epic 3 starts)
- Daily.co account setup (when Epic 4 starts)

## Context Notes
- Project follows SOLID principles throughout
- Zero circular dependencies is a hard requirement
- All code must be TypeScript strict mode compliant
- Memory Bank should be updated after significant changes

