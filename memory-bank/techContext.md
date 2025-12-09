# Technical Context

## Tech Stack (Locked)

### Core Framework
- **Vite 7+** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript 5.9+** - Type safety (strict mode)
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library

### Backend & Services
- **Firebase v9+ (modular)**
  - Auth (Anonymous + Email magic links)
  - Firestore (rooms, tasks, notes)
  - Functions (magic link generation, phase transitions)
  - Hosting (production deployment)
- **Liveblocks** - Real-time collaboration (presence, storage, Yjs)
- **Daily.co** - Video/voice (100ms as backup)

### State Management
- **Zustand 4+** - Client-side state
- **TanStack Query** - Server state management
- **Liveblocks** - Real-time collaborative state

### Editor
- **CodeMirror 6** - Code editor
- **Yjs** - CRDT for code synchronization (via Liveblocks)

### Utilities
- **Lucide React** - Icons
- **clsx** + **tailwind-merge** - Class name utilities
- **zod** - Runtime validation
- **class-variance-authority** - Component variants

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI (for deployment)
- Cursor IDE (recommended)

### Environment Variables
Required in `.env.local`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_LIVEBLOCKS_PUBLIC_KEY=
VITE_DAILY_API_KEY=
VITE_DAILY_DOMAIN=
```

### Project Structure
```
/
  .cursor/rules/        # Cursor IDE rules
  memory-bank/          # Project documentation
  src/
    modules/            # Feature modules (main code)
    hooks/              # Shared custom hooks
    types/              # Global TypeScript types
    lib/                # Utilities (firebase, liveblocks, daily)
    components/         # shadcn/ui components
    data/               # Sample data
  docs/                 # PRD, TASKS
  public/               # Static assets
```

## Technical Constraints

### TypeScript
- **Strict mode enabled** - `noUnusedLocals`, `noUnusedParameters`, etc.
- **No `any` types** - Use `unknown` or proper types
- **Path aliases** - Use `@/` for absolute imports
- **Barrel exports** - All modules export via `index.ts`

### Code Quality
- **ESLint** - TypeScript ESLint, React hooks, import sorting
- **No relative imports going up** - Use `@/` instead of `../`
- **Feature-sliced design** - Modules are self-contained
- **SOLID principles** - Applied throughout

### Performance
- **Code splitting** - Lazy load routes and heavy components
- **Lazy load Daily.co** - Only load when needed
- **React.memo** - Where needed for optimization
- **Bundle analysis** - Track bundle size

### Accessibility
- **ARIA labels** - All interactive elements
- **Keyboard navigation** - Full keyboard support
- **Focus management** - Proper focus handling
- **Screen reader support** - Semantic HTML

## Dependencies

### Production
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "firebase": "^10.x.x",
  "@liveblocks/client": "^1.x.x",
  "@daily-co/daily-js": "^0.x.x",
  "zustand": "^4.x.x",
  "@tanstack/react-query": "^5.x.x",
  "zod": "^3.x.x",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "lucide-react": "^0.556.0"
}
```

### Development
```json
{
  "typescript": "~5.9.3",
  "vite": "^7.2.4",
  "@vitejs/plugin-react": "^5.1.1",
  "eslint": "^9.39.1",
  "typescript-eslint": "^8.46.4",
  "simple-import-sort": "^12.x.x"
}
```

## Build & Deployment

### Development
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Deployment
- **Firebase Hosting** - Production hosting
- **GitHub Actions** - CI/CD pipeline
- **Auto-deploy** - On merge to `main` branch

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

