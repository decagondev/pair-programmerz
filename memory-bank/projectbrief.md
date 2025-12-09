# Project Brief: PairCode

## Vision
**"Like Figma, but for technical interviews"**

PairCode is a real-time pair programming interview platform that replaces traditional LeetCode-style interviews with collaborative coding sessions. Candidates and interviewers work together in a shared code editor with video, voice, and presence features—creating a more authentic assessment of real-world coding skills.

## Core Requirements

### Primary Goals
1. **Real-time collaborative coding** - Multiple users can edit code simultaneously with driver/navigator roles
2. **Video & voice integration** - Seamless communication during interviews
3. **Interview phase management** - Structured flow: Set Tone → Code → Reflection
4. **Task library** - Real production bugs and features, not algorithmic puzzles
5. **Session recording & feedback** - Capture interview data for review

### Key Differentiators
- No LeetCode-style problems—focus on real production code
- Driver/Navigator pair programming model
- Real-time collaboration with presence awareness
- Structured interview phases with timers
- Reflection and feedback capture

## Success Metrics
- Smooth real-time collaboration (sub-100ms latency)
- Zero knowledge loss (Memory Bank + Cursor rules)
- 100% TypeScript strict mode compliance
- Zero circular dependencies
- Modular, testable architecture

## Constraints
- Tech stack is locked (see techContext.md)
- Must follow SOLID principles
- Feature-sliced design architecture
- Cursor IDE as single source of truth

## Project Scope
- 8 Epics, 33 PRs, ~150 commits
- MVP includes: Auth, Rooms, Editor, Video, Timer, Reflection, Tasks, Polish
- Future enhancements: Advanced analytics, multi-language support, custom task creation

