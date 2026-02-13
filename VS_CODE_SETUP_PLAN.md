# VS Code Setup Plan

## Goal
Establish a stable, team-friendly VS Code development environment for `tollugatti-mobile` with consistent formatting, linting, debugging, and onboarding.

## Scope
This plan covers:
- Extension standardization
- Workspace settings standardization
- Launch/debug profile setup
- Verification and ongoing maintenance

This plan does not cover:
- Mobile app architecture
- CI/CD for app build/deploy
- Codebase-specific lint rule design

## Current Baseline
Already present in this repository:
- `.vscode/extensions.json`
- `.vscode/settings.json`
- `.vscode/launch.json`

Recommended extensions are already installed globally on the current machine.

## Implementation Plan

### Phase 1: Workspace Baseline (Complete)
1. Define required extensions in `.vscode/extensions.json`.
2. Configure editor/lint behavior in `.vscode/settings.json`.
3. Add mobile debug profile in `.vscode/launch.json`.

### Phase 2: Team Onboarding
1. Open `/Users/shashi/Projects/tollugatti-mobile` in VS Code.
2. Accept all recommended extensions when prompted.
3. Run `Developer: Reload Window`.
4. Confirm formatting and linting trigger on save.

### Phase 3: Validation Checklist
Run this checklist after setup:
1. Create a temporary `test.ts` file and save it.
Expected: format-on-save applies.
2. Add a known lint issue in `test.ts` and save.
Expected: ESLint highlights appear.
3. Open Run and Debug and select `Expo (mobile)`.
Expected: command points to `npx expo start --dev-client`.
4. Remove temporary file.

### Phase 4: Maintenance
1. Review extension versions monthly.
2. Keep recommendations lean (only broadly required tools).
3. Update `.vscode/settings.json` only when team-wide behavior needs to change.
4. Re-verify launch profile when project scripts or paths change.

## Risks and Mitigations
- Risk: Developer-specific preferences conflict with workspace defaults.
Mitigation: Keep only project-critical settings in workspace; personal preferences remain in user settings.

- Risk: New contributors skip extension install prompts.
Mitigation: Keep this plan in repo root and mention setup in onboarding docs/PR template.

- Risk: Launch profile breaks when project structure evolves.
Mitigation: Revalidate launch profile after major repo changes.

## Ownership
- Primary owner: Mobile project maintainers.
- Review cadence: once per month or before major onboarding waves.

## Definition of Done
1. Required `.vscode` files exist and are versioned.
2. New team members can onboard with consistent editor behavior.
3. `Expo (mobile)` launch profile works in VS Code.
4. This plan remains in repository root for discoverability.
