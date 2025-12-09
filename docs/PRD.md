# FULL PRD – PairCode: Real-Time Pair Programming Interview Platform  
**"Like Figma, but for technical interviews"**

**Tech Stack (locked)**  
- Vite + React 18 + TypeScript  
- Tailwind CSS v4 + shadcn/ui (already initialized by you)  
- Firebase v9+ (Auth, Firestore, Functions, Hosting)  
- Liveblocks (primary real-time) — fallback Yjs if needed  
- Daily.co (video/voice) — 100ms as backup  
- Zustand + TanStack Query  
- Lucide icons, clsx, tailwind-merge  
- Cursor IDE + Memory Bank (Epic 0)

Follows **SOLID**, **modular monorepo-style**, **feature-sliced design**

---

### EPIC 0 – Project Memory Bank & Foundation (Cursor-First Setup)

Goal: Everything lives in Cursor’s memory forever. No knowledge loss.

| PR # | Title                                   | Commits / Sub-tasks                                                                                   |
|------|-----------------------------------------|--------------------------------------------------------------------------------------------------------|
| 0.1  | Initialize Memory Bank & Project Rules  | • Create `.cursor/rules/` with coding standards<br>• Add `MEMORY_BANK.md` (this PRD + decisions)<br>• Add `ARCHITECTURE.md`<br>• Configure Cursor MCP for Firebase & Liveblocks |
| 0.2  | Enforce SOLID + Folder Structure         | • `/src/modules/` becomes the single source of truth<br>• Create `src/lib/`, `src/hooks/`, `src/types/`<br>• Add barrel files (`index.ts`)<br>• ESLint + Prettier + simple-import-sort rules |
| 0.3  | Global State & Config Module             | • Create `src/modules/config/` (env, firebase, liveblocks, daily)<br>• Create `src/modules/store/` (Zustand base store)<br>• Create `src/modules/ui/` (Toast, ThemeProvider, etc.) |

Status: Ready for you to merge after your Vite + Tailwind + shadcn starter

---

### EPIC 1 – Authentication & Magic Links

| PR # | Title                                  | Commits / Sub-tasks                                                                                      |
|------|----------------------------------------|----------------------------------------------------------------------------------------------------------|
| 1.1  | Firebase Auth + Custom Token Service   | • `src/modules/auth/firebase.ts`<br>• Anonymous + Email magic link auth<br>• `useAuth` hook (Zustand)     |
| 1.2  | Magic Link Flow (Candidate Side)       | • `/join/[token]` page<br>• Validate token → sign in → redirect to room<br>• Loading + error states     |
| 1.3  | Protected Route HOC + Role Detection   | • `RequireAuth`, `RequireRole`<br>• Detect interviewer vs candidate from Firestore room doc             |

---

### EPIC 2 – Room Creation & Management (Interviewer Dashboard)

| PR # | Title                                   | Commits / Sub-tasks                                                                                           |
|------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------|
| 2.1  | Dashboard Layout + Room List            | • `/dashboard` route<br>• Firestore collection `rooms`<br>• Realtime room list with status (active, finished) |
| 2.2  | Create Room Wizard                      | • Select task from predefined list<br>• Auto-generate magic link<br>• Copy-to-clipboard + QR code         |
| 2.3  | Room Document Model + Security Rules    | • Firestore schema: `rooms/{roomId}` with `taskId`, `participants`, `phase`, `createdBy`<br>• Security rules allowing only participants |

---

### EPIC 3 – Real-Time Collaborative Editor (Core Feature)

| PR # | Title                                       | Commits / Sub-tasks                                                                                           |
|------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| 3.1  | Liveblocks Setup + Presence                 | • Liveblocks client + room provider<br>• Avatar stack + cursor awareness<br>• Yjs document for code          |
| 3.2  | CodeMirror 6 + TypeScript + Tailwind Theme  | • Custom dark/light theme matching shadcn<br>• Read-only mode for Navigator<br>• Sync with Yjs               |
| 3.3  | Driver / Navigator Role Switching           | • Button to request/take control<br>• Liveblocks storage for `driverId`<br>• Visual indicator (big label)    |
| 3.4  | File Tree + Task Starter Code Loading       | • Load `starterCode` from selected task<br>• Simple file explorer (src/App.tsx, components/, etc.)           |

---

### EPIC 4 – Video, Voice & Presence UI

| PR # | Title                            | Commits / Sub-tasks                                                                            |
|------|----------------------------------|------------------------------------------------------------------------------------------------|
| 4.1  | Daily.co Integration             | • Prebuilt embed `<DailyIframe />`<br>• Auto-join on room enter<br>• Mic/camera controls        |
| 4.2  | Floating Video Grid + Screen Share | • Movable video tiles (like Figma)<br>• Screen share button (Daily supports it natively)       |
| 4.3  | Reactions & Raise Hand           | • Emoji rain on click<br>• Raise hand → notification bell                                          |

---

### EPIC 5 – Timer & Interview Phases

| PR # | Title                               | Commits / Sub-tasks                                                                                 |
|------|-------------------------------------|-----------------------------------------------------------------------------------------------------|
| 5.1  | Phase Engine (Set Tone → Code → Reflection) | • Firestore `phase: 'tone' \| 'coding' \| 'reflection' \| 'ended'`<br>• Auto-advance with warnings |
| 5.2  | Big Visible Timer + Sound Alerts    | • Countdown in header<br>• 5-min, 2-min, 0-min sounds (subtle)                                      |
| 5.3  | Phase-Specific UI Locking           | • Hide editor in reflection<br>• Show reflection form only in reflection phase                     |

---

### EPIC 6 – Reflection & Feedback Capture

| PR # | Title                               | Commits / Sub-tasks                                                                                 |
|------|-------------------------------------|-----------------------------------------------------------------------------------------------------|
| 6.1  | Reflection Form (Candidate)         | • Multi-question form (shadcn)<br>• “What would you improve for production?”<br>• Auto-save         |
| 6.2  | Interviewer Private Notes           | • Rich text (TipTap or simple textarea)<br>• Saved to `rooms/{roomId}/privateNotes`                 |
| 6.3  | Post-Session Summary Page           | • Summary of answers + notes + recording link (if enabled)<br>• Export as PDF button               |

---

### EPIC 7 – Task Library (Real Bugs & Features)

| PR # | Title                               | Commits / Sub-tasks                                                                                 |
|------|-------------------------------------|-----------------------------------------------------------------------------------------------------|
| 7.1  | Task Schema + Admin CRUD            | • Firestore `tasks` collection<br>• Admin page to add/edit tasks<br>• Markdown description        |
| 7.2  | 5 Real Production Tasks Included    | • Dark mode persistence bug<br>• Pagination infinite scroll<br>• Form validation edge case<br>• Chart re-render performance<br>• Drag & drop reordering |

---

### EPIC 8 – Polish, Accessibility & Deployment

| PR # | Title                                   | Commits / Sub-tasks                                                                    |
|------|-----------------------------------------|----------------------------------------------------------------------------------------|
| 8.1  | Mobile-Responsive Layout                | • Editor shrinks, video goes bottom on small screens                                   |
| 8.2  | Keyboard Shortcuts + Accessibility      | • Cmd/Ctrl + Enter to send message<br>• Focus management, ARIA labels                  |
| 8.3  | Firebase Hosting + CI/CD                | • GitHub Actions → `firebase deploy` on merge to main                                  |
| 8.4  | Performance & Bundle Analysis           | • Lazy load Daily.co, code splitting, React.memo everywhere needed                     |

---

### Final Folder Structure (Feature-Sliced + SOLID)

```
/src
  /modules
    /auth
    /room
    /editor
    /video
    /timer
    /task
    /feedback
    /dashboard
    /config
    /store
    /ui
  /lib          → firebase, liveblocks, daily, utils
  /hooks        → useRoom, usePresence, useDriver, etc.
  /types        → global TS types
  /data         → sampleTasks fallback
  /components   → dumb shadcn wrappers
```

Every module owns its:
- Types
- Hooks
- Components
- Store slice
- Firebase rules snippet

Zero circular dependencies · 100% testable · Cursor will love it

---

Next step?

Say: **“Start Epic 0”** or **“Drop PR 1.1 code”** and I’ll give you the exact files, commit messages, and Cursor instructions to paste.

Let’s ship the best pair-programming interview tool that has ever existed. No LeetCode. Just real code, real humans.