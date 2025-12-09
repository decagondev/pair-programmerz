# PairCode – Full Tasklist  
Broken down into **Epics → PRs → Commits → Sub-tasks**  
Ready to paste directly into GitHub Projects / Linear / Notion / Cursor Tasks

Everything follows **SOLID**, **feature-sliced design**, **100% TypeScript strict**, and is built with **Cursor IDE as the single source of truth**.

Current date: Dec 09, 2025  
Stack: Vite + React 18 + TS + Tailwind 4 + shadcn/ui + Firebase + Liveblocks + Jitsi Meet

### EPIC 0 – Cursor Memory Bank & Project Foundations (The Eternal Brain)

| PR # | Title & Goal                                               | Commits & Sub-tasks (exact order)                                                                                                                                                  | Cursor Rule Created |
|------|------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| 0.1  | Initialize Memory Bank & Decision Log                       | 1. Create `MEMORY_BANK.md` (this entire tasklist + future decisions)<br>2. Create `ARCHITECTURE.md`<br>3. Create `DECISIONS/` folder for ADRs | Yes |
| 0.2  | Create 15+ Cursor Rules (the DNA of the project)           | See full list below – each commit adds 1–3 rules to `.cursor/rules/`                                                                                                               | Yes |
| 0.3  | Enforce Folder-by-Feature + SOLID Structure                   | 1. Create `/src/modules` as only feature folder<br>2. Add `src/lib`, `src/hooks`, `src/types`<br>3. Add barrel files everywhere<br>4. ESLint + simple-import-sort + @typescript-eslint | Yes |
| 0.4  | Global Config & Environment Module                         | 1. `src/modules/config/env.ts` (zod validation)<br>2. `src/modules/config/firebase.ts`<br>3. `src/modules/config/liveblocks.ts`<br>4. `src/modules/config/jitsi.ts` | Yes |
| 0.5  | Global Store Foundation (Zustand + Persistence)            | 1. Create `src/modules/store/index.ts`<br>2. Add `useUserStore`, `useRoomStore` skeletons<br>3. Add Zustand middleware (devtools + persist) | Yes |

#### Cursor Rules Added in Epic 0 (copy-paste these into `.cursor/rules/`)

```md
# .cursor/rules/01-naming-and-structure.md
- Always use feature-sliced design: /src/modules/<feature>/
- Every module must export only via index.ts (barrel)
- Component files: PascalCase.tsx, hooks: useSomething.ts
- Never use relative paths going up: use absolute imports with @/

# .cursor/rules/02-solid-and-clean-code.md
- Single Responsibility: one component = one job
- Never put Firebase calls inside components → use custom hooks in /hooks
- All async state → TanStack Query or Zustand actions
- No any – use unknown or proper types

# .cursor/rules/03-firebase-best-practices.md
- All Firestore calls go through /lib/firebase/*.ts
- Never use onSnapshot directly in components → use useFirestoreQuery hook
- Security rules must be written in /firebase/rules.snippets/

# .cursor/rules/04-liveblocks-usage.md
- All Liveblocks presence/storage goes through useRoomContext()
- Never access window.liveblocks directly
- Driver ID always stored in storage.driverId

# .cursor/rules/05-shadcn-and-tailwind.md
- Always use cn() from ~/lib/utils (tailwind-merge + clsx)
- Never use inline styles or !important
- Prefer shadcn components over raw HTML

# .cursor/rules/06-interview-flow.md
- Phase is sacred: only one source of truth in Firestore rooms/{id}.phase
- Timer never runs client-side only – server timestamp fallback
```

### EPIC 1 – Authentication & Magic Links

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 1.1  | Firebase Auth + Anonymous + Magic Link Setup    | • Initialize Firebase app<br>• Create `useAuth` hook<br>• Anonymous auth on load<br>• Custom token endpoint (Cloud Function)       |
| 1.2  | Magic Link Generation & Validation              | • Cloud Function: generateMagicLink(roomId, role)<br>• `/join/[token]` page<br>• Validate token → sign in → redirect                 |
| 1.3  | Protected Routes & Role Detection               | • `RequireAuth` component<br>• `useRole` hook (interviewer | candidate)<br>• Redirect wrong role                                    |

### EPIC 2 – Interviewer Dashboard & Room Creation

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 2.1  | Dashboard Layout + Active Rooms List            | • `/dashboard` route<br>• Realtime Firestore list of rooms<br>• Status badges (waiting, in-progress, finished)                    |
| 2.2  | Create Room Wizard                              | • Task selector dropdown<br>• Auto-generate magic link + candidate link<br>• QR code + copy button                                 |
| 2.3  | Firestore Room Model + Security Rules           | • Define full room schema<br>• Write security rules<br>• Add rules test file                                                          |

### EPIC 3 – Collaborative Editor (The Heart)

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 3.1  | Liveblocks Room Provider + Presence             | • `<LiveblocksProvider>` wrapper<br>• Avatar stack<br>• Cursor awareness with names                                                      |
| 3.2  | CodeMirror 6 + Yjs Binding + Tailwind Theme     | • Custom theme matching shadcn<br>• TypeScript language support<br>• Read-only mode when not driver                                 |
| 3.3  | Driver/Navigator Mode + Role Switching          | • Big “You are Driving” banner<br>• Request/Take control flow<br>• Sync driverId in Liveblocks storage                             |
| 3.4  | File Explorer + Starter Code Loading            | • Simple tree (App.tsx, components/, lib/)<br>• Load task.starterCode on room start                                                |

### EPIC 4 – Video & Presence UI

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 4.1  | Jitsi Meet React SDK Integration               | • `<JitsiVideo />` component using `JitsiMeeting`<br>• Auto-join with displayName = role<br>• Mic/camera UI via External API |
| 4.2  | Floating/Movable Video Tiles + Screen Share     | • Jitsi video rendering<br>• Screen share button (Jitsi native via External API)                                                    |
| 4.3  | Emoji Reactions & Raise Hand                     | • Click → emoji flies<br>• Raise hand → bell notification                                                                 |

### EPIC 5 – Timer & Phase Engine

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 5.1  | Server-Controlled Phase System                  | • Firestore field `phase`<br>• Phase transition Cloud Function<br>• Auto-advance after 5/45/10 min                        |
| 5.2  | Big Timer + Sound Alerts                        | • Countdown in header<br>• Subtle chimes at 5 min, 2 min, 0 min                                                                    |
| 5.3  | Phase-Specific UI Locking                       | • Hide editor in reflection<br>• Show only reflection form<br>• Disable video mute during tone phase (optional)                |

### EPIC 6 – Reflection & Feedback

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 6.1  | Candidate Reflection Form                       | • 4–5 open questions (shadcn form)<br>• Auto-save every change                                                                     |
| 6.2  | Interviewer Private Notes (TipTap)              | • Rich text editor<br>• Saved to private sub-collection                                                                            |
| 6.3  | Session Summary + PDF Export                    | • Final page with answers + notes<br>• Generate & download PDF (react-pdf)                                                        |

### EPIC 7 – Task Library (Real Bugs)

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 7.1  | Task CRUD for Admins                            | • `/admin/tasks` page<br>• Rich description (Markdown)<br>• starterCode field                                                     |
| 7.2  | Seed 6 Real Production Tasks                    | • Dark mode persistence<br>• Infinite scroll bug<br>• Form validation race condition<br>• Chart performance<br>• Drag & drop<br>• Auth redirect loop |

### EPIC 8 – Polish & Ship

| PR # | Title                                           | Commits & Sub-tasks                                                                                                              |
|------|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| 8.1  | Mobile & Tablet Responsiveness                  | • Stack layout on <768px<br>• Touch-friendly controls                                                                              |
| 8.2  | Accessibility + Keyboard Shortcuts              | • All buttons focusable<br>• Cmd+Enter to send message<br>• Screen reader labels                                               |
| 8.3  | Firebase Hosting + CI/CD                        | • GitHub Actions workflow<br>• Auto-deploy on merge to main                                                                        |
| 8.4  | Lighthouse 95+ & Bundle Optimization            | • Code splitting<br>• Lazy Jitsi Meet<br>• Image optimization (none needed)                                                         |

Total: **8 Epics | 33 PRs | ~150 commits**
