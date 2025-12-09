# Technical Context

## Tech Stack (Locked)

### Core Framework
- **Vite 7+** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript 5.9+** - Type safety (strict mode)
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **React Router DOM** - Client-side routing

### Backend & Services
- **Firebase v9+ (modular)**
  - Auth (Anonymous + Email magic links)
  - Firestore (rooms, tasks, notes)
  - Functions (magic link generation, phase transitions)
  - Hosting (production deployment)
- **Liveblocks** - Real-time collaboration (presence, storage, Yjs)
- **Daily.co** - Video/voice (100ms as backup)

### State Management
- **Zustand 4+** - Client-side state (UI state, user preferences)
- **TanStack Query 5+** - Server state management (Firestore queries, mutations)
  - Configured with QueryClientProvider in main.tsx
  - Real-time subscriptions via Firestore onSnapshot with cache updates
  - Default staleTime: 5 minutes, refetchOnWindowFocus: false
- **Liveblocks** - Real-time collaborative state

### Editor
- **CodeMirror 6** - Code editor
- **Yjs** - CRDT for code synchronization (via Liveblocks)

### Utilities
- **Lucide React** - Icons
- **clsx** + **tailwind-merge** - Class name utilities
- **zod** - Runtime validation
- **class-variance-authority** - Component variants
- **react-hook-form** - Form management
- **@hookform/resolvers** - Form validation resolvers (zod)
- **date-fns** - Date formatting utilities
- **@jitsi/react-sdk** - Jitsi Meet React SDK for video/voice
- **@daily-co/daily-js** - Daily.co video/voice SDK

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
  functions/            # Firebase Cloud Functions
    src/
      index.ts          # Cloud Functions (generateMagicLink placeholder)
  src/
    modules/            # Feature modules (main code)
      auth/             # Authentication module (Epic 1 ✅)
      config/           # Configuration modules
      store/            # Zustand store
      ...               # Other modules (room, editor, etc.)
    hooks/              # Shared custom hooks
    types/              # Global TypeScript types
    lib/                # Utilities (firebase, liveblocks, daily)
      firebase/         # Firebase utilities (auth, magicLink, roles)
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
- **TypeScript strict mode** - All build errors resolved, build passes successfully
- **Unused parameter convention** - Prefix unused parameters with `_` (e.g., `_email`, `_uid`)

### Performance
- **Code splitting** - Lazy load routes and heavy components
- **Lazy load Jitsi Meet** - Only load when needed (JitsiMeeting component)
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
  "react-router-dom": "^7.10.1",
  "firebase": "^12.6.0",
  "@liveblocks/client": "^3.11.1",
  "@daily-co/daily-js": "^0.85.0",
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.x.x",
  "zod": "^4.1.13",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "lucide-react": "^0.556.0",
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "date-fns": "^3.x.x"
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
- **Firestore Rules** - Security rules in `firestore.rules`
- **GitHub Actions** - CI/CD pipeline
- **Auto-deploy** - On merge to `main` branch

## TanStack Query Setup

### Configuration
- QueryClient configured in `src/main.tsx` with QueryClientProvider
- Default options:
  - `staleTime`: 5 minutes
  - `refetchOnWindowFocus`: false
- Real-time subscriptions use Firestore `onSnapshot` with manual cache updates

### Usage Pattern
```typescript
// Real-time subscription with TanStack Query
const [data, setData] = useState<T[]>([])

useEffect(() => {
  const unsubscribe = subscribeToData((updated) => {
    setData(updated)
    queryClient.setQueryData(['key'], updated)
  })
  return () => unsubscribe()
}, [])

const query = useQuery({ queryKey: ['key'], queryFn: () => data })
return { ...query, data }
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

