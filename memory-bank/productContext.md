# Product Context: PairCode

## Why This Project Exists

### Problem Statement
Traditional technical interviews fail to assess real-world coding skills:
- LeetCode problems don't reflect actual work
- Solo coding doesn't show collaboration ability
- No real-time feedback or pair programming experience
- Interviewers struggle to evaluate communication and problem-solving process

### Solution
PairCode provides a collaborative interview environment where:
- Candidates work on real production bugs/features
- Interviewers observe problem-solving in real-time
- Both parties collaborate through driver/navigator roles
- Structured phases ensure comprehensive evaluation

## User Experience Goals

### For Interviewers
- **Easy room creation** - Select task, generate magic link, share with candidate
- **Real-time observation** - See candidate's thought process, code changes, and communication
- **Structured evaluation** - Timer-based phases guide the interview flow
- **Comprehensive notes** - Private notes and reflection capture for post-interview review

### For Candidates
- **Simple entry** - Magic link → auto-join → start coding
- **Clear roles** - Understand when driving vs navigating
- **Real-time collaboration** - Natural pair programming experience
- **Structured reflection** - Guided questions to share insights

## How It Should Work

### Interview Flow
1. **Set Tone (5 min)** - Introductions, task overview, expectations
2. **Coding (45 min)** - Driver/navigator pair programming on real task
3. **Reflection (10 min)** - Candidate answers reflection questions
4. **End** - Summary page with notes, answers, and optional recording

### Key Interactions
- **Driver/Navigator switching** - Visual indicator, one-click role change
- **Real-time code sync** - All participants see changes instantly
- **Video presence** - Floating, draggable video tiles (Figma-style)
- **Timer awareness** - Big visible countdown with sound alerts
- **Phase transitions** - Automatic with warnings, UI adapts to phase

## User Stories

### Interviewer
- As an interviewer, I want to create a room quickly so I can start interviews on time
- As an interviewer, I want to see candidate's code changes in real-time so I can assess problem-solving
- As an interviewer, I want to take private notes so I can remember key observations
- As an interviewer, I want structured phases so interviews stay on track

### Candidate
- As a candidate, I want to join easily via magic link so I don't waste time on setup
- As a candidate, I want clear role indicators so I know when I'm driving
- As a candidate, I want to see interviewer's presence so collaboration feels natural
- As a candidate, I want reflection questions so I can share my thought process

## Design Principles
- **Figma-like UX** - Familiar, intuitive interface
- **Real-time first** - Everything syncs instantly
- **Role clarity** - Always know who's driving
- **Phase awareness** - UI adapts to interview phase
- **Accessibility** - Keyboard shortcuts, screen reader support, focus management

