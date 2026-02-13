# tollugatti-mobile

Android-first Expo app workspace for Tollugatti.

## Current Status
- Expo + TypeScript scaffold is initialized.
- Expo Router is configured with starter screens in `app/`.
- Environment endpoints are loaded from `EXPO_PUBLIC_*` variables.

## Quick Start
0. Use Node LTS:
   - `nvm use` (project includes `.nvmrc` with `20`)
1. Install dependencies:
   - `npm install`
2. Start Expo:
   - `npm run start`
3. Run on Android:
   - `npm run android`

## Development Endpoints (Local)
- Auth portal: `http://localhost:3001`
- API: `http://localhost:3000`
- Game server: `http://localhost:8000`
- Lobby server: `http://localhost:8080`

## Environment Variables
Use `.env.local` with Expo-prefixed public variables:
- `EXPO_PUBLIC_AUTH_URL`
- `EXPO_PUBLIC_AUTH_LOGIN_PATH` (default: `/login`)
- `EXPO_PUBLIC_AUTH_REDIRECT_SCHEME` (default: `tollugatti`)
- `EXPO_PUBLIC_AUTH_MOBILE_AUTHORIZE_PATH` (default: `/api/auth/mobile/authorize`)
- `EXPO_PUBLIC_AUTH_MOBILE_EXCHANGE_PATH` (default: `/api/auth/mobile/exchange`)
- `EXPO_PUBLIC_AUTH_LOGOUT_PATH` (default: `/api/auth/logout`)
- `EXPO_PUBLIC_AUTH_ME_PATH` (default: `/api/me`)
- `EXPO_PUBLIC_AUTH_PROFILE_PATH` (default: `/api/profile`)
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_GAME_SERVER_URL`
- `EXPO_PUBLIC_LOBBY_SERVER_URL`

See `.env.example` for defaults.

## Auth Flow (Current)
- App opens `/login` with `returnUrl` pointing to `/api/auth/mobile/authorize`.
- `/api/auth/mobile/authorize` then redirects back to app callback URL with `code`.
- App reads `code` from callback URL and calls `POST /api/auth/mobile/exchange`.
- Session bootstrap/refresh uses `GET /api/me` and reads:
  - `user`
  - `tenants`
  - `session`
- Logout uses `POST /api/auth/logout`.
- Requests use `credentials: "include"` to rely on the auth cookie session.

## Profile Feature
- Home screen includes `Edit Profile` navigation after sign-in.
- Profile screen route: `/profile`
- Update flow uses `PATCH /api/profile` with:
  - `displayName`
  - `handle`
  - `city`
  - `avatarUrl`

## Project Documentation
- Mobile implementation plan: [`MOBILE_PROJECT_PLAN.md`](./MOBILE_PROJECT_PLAN.md)
- VS Code setup plan: [`VS_CODE_SETUP_PLAN.md`](./VS_CODE_SETUP_PLAN.md)
