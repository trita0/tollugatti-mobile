# Tollugatti Mobile Project Plan

## 1) Objective
Build `tollugatti-mobile` as an Android-first, iOS-ready mobile app for Tollugatti’s game ecosystem, aligned to PRD vScale0:
- Digital multiplayer traditional games
- Competitive layers (ranked, tournaments, leagues)
- Mobile game assistant
- Physical match logging and verification
- Community/workshop participation

## 2) Platforms and Delivery Strategy
- Primary platform: Android
- Secondary platform: iOS (parity after Android hardening)
- Framework: React Native + Expo (TypeScript)
- Release approach:
  - Android: Internal -> Closed testing -> Production
  - iOS: TestFlight -> App Store

## 3) Development Endpoints (Local)
- Auth portal: `http://localhost:3001`
- API: `http://localhost:3000`
- Game server: `http://localhost:8000`
- Lobby server: `http://localhost:8080`

## 4) In-Scope Features (PRD-Aligned)

### A. Game Engine (Digital)
- Multi-game support with boardgame.io-compatible realtime flows
- Priority games:
  1. Aadu Huli
  2. Chowka Bara
  3. Navakankari
- Realtime state sync over WebSockets (`games.tollugatti.com`)
- Localized UI: Kannada, English, Telugu, Tamil, Hindi

### B. Contest and Competitive Space
- Ranked 1v1 matchmaking with Elo
- Tournament participation:
  - Bracket display
  - Match room join/start
  - Result progression
- League participation:
  - Fixtures
  - Standings
  - Points progression
- Third-party hosted contest participation

### C. Mobile-Only Game Assistant
- Next-move suggestion panel
- Win probability HUD
- Training mode with guide video references and in-board hints

### D. Physical Match Tracking
- Offline-first physical match logging
- QR handshake verification with opponent
- Photo evidence capture/upload
- Background sync for pending logs/uploads

### E. Community and Social
- Workshop join flows with board sync support
- Talkspace threads per game
- Team hub basics (team feed, schedules, standings)
- Audio rooms (post-MVP)

## 5) Technical Architecture

### Client Stack
- Expo + React Native + TypeScript
- Expo Router for navigation
- TanStack Query for API caching/retries
- Zustand for app/session UI state
- react-hook-form + zod for forms/validation

### Realtime and Game Connectivity
- boardgame.io client integration for game sessions
- socket.io-client where backend channels require it
- Reconnect + resume logic for app lifecycle changes

### Storage and Security
- expo-secure-store for auth tokens
- expo-sqlite for offline queue (physical logs, retry jobs)
- JWT auth with refresh flow via existing backend

### Mobile Capabilities
- expo-camera (QR scan + capture)
- expo-image-picker (photo evidence)
- expo-notifications (invites, match ready, reminders)

### Quality and Ops
- Sentry for crashes/perf
- EAS Build/Update for delivery
- Feature flags for phased rollout

## 6) API and Backend Alignment Plan

### Keep as System of Record
- Existing Tollugatti API and database interactivity remain intact
- Existing auth + games + tournaments + teams + social APIs reused

### Required Alignment Tasks
1. Standardize token-based auth behavior for mobile clients.
2. Confirm endpoint consistency for all game flows.
3. Ensure match history + leaderboard endpoints are stable and documented.
4. Document websocket handshake and reconnect semantics.
5. Validate upload endpoints for photo evidence on mobile network conditions.

## 7) Delivery Phases and Milestones

### Phase 0: Foundation (Week 1-2)
- Repo bootstrap and app shell
- Auth/session plumbing
- Networking layer + error handling
- Telemetry + environment setup
- CI baseline

### Phase 1: Core Gameplay MVP (Week 3-6)
- Game lobby + matchmaking
- Aadu Huli, Chowka Bara, Navakankari integration
- Realtime turn sync + reconnection
- Games leaderboard + match history
- Android QA pass 1

### Phase 2: Competitive + Physical Tracking (Week 7-9)
- Tournament join + bracket + match progression
- League standings and fixtures
- Physical log, QR verify, photo evidence upload
- Offline queue + sync retry engine
- Android QA pass 2 and beta rollout

### Phase 3: Assistant + Community Layer (Week 10-12)
- Next move + probability HUD
- Training mode v1
- Workshop entry + Talkspace threads + team basics
- iOS parity + TestFlight

### Phase 4: Scale and Optimization (Week 13+)
- Audio rooms
- Spectator mode
- Growth features and advanced anti-cheat signals
- Performance tuning based on production telemetry

## 8) Must / Should / Could Prioritization

### Must (MVP)
- Auth and session restoration
- 3 priority games with realtime multiplayer
- Matchmaking + Elo result updates
- Tournament participation basics
- Games leaderboard + history
- Offline physical logging + QR + photo evidence
- Android production readiness

### Should (v1.1)
- League UX completeness
- Assistant quality improvements
- Workshop + Talkspace + teams baseline
- iOS parity release

### Could (v1.2+)
- Audio rooms
- Spectator mode
- Host-lite controls on mobile
- Advanced growth and reward mechanics

## 9) Acceptance Criteria (Core)
1. User can join and complete a ranked game end-to-end on Android without manual refresh.
2. Disconnect/reconnect returns user to active match safely.
3. Tournament participant can view bracket and join assigned match from mobile.
4. Physical match can be logged offline and synced later with verification artifacts.
5. Leaderboard and match history reflect completed game results.
6. App supports all 5 target languages for core gameplay surface.

## 10) Risks and Mitigations
- Websocket instability on mobile lifecycle transitions
  - Mitigation: robust reconnect strategy + state reconciliation
- API contract drift across game endpoints
  - Mitigation: endpoint contract sheet + smoke tests
- Auth inconsistency between cookie-first web and token-first mobile
  - Mitigation: explicit mobile auth contract and refresh policy
- Low-end Android performance constraints
  - Mitigation: strict FPS/memory profiling and staged rollouts

## 11) KPIs
- DAU (games)
- Match completion rate
- Matchmaking success rate
- Tournament invite-to-join conversion
- Physical logs per week
- 30-day retention
- Crash-free sessions

## 12) Immediate Next Actions (Execution Queue)
1. Create app scaffold and environment matrix.
2. Produce endpoint contract checklist for game-critical APIs.
3. Implement auth/session module with secure storage.
4. Implement lobby + matchmaking vertical slice for one game.
5. Validate end-to-end on Android test devices.
6. Expand to remaining priority games.

