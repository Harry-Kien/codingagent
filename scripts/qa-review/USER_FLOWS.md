# USER_FLOWS.md

## Happy Path: First Kit In Demo Mode
1. User opens /.
2. User enters: AI video app for small shops that generates product showcase videos from product photos and descriptions.
3. User chooses 7 day build and Builder.
4. User clicks Generate.
5. System creates a kit without API keys.
6. User opens Start Build and copies the first coding-agent prompt.
7. User exports Codex Pack or ZIP.

Success criteria: user can hand the exported files to a coding agent without writing a new brief.

## Happy Path: Provider-Backed Deep Planning
1. User configures a provider in Settings.
2. User chooses Deep planning.
3. System generates richer architecture, tasks, repo references, and prompts.
4. If provider fails, system returns demo fallback with explanation.

## Failure Path: Provider Or Repo Reference Fallback
1. Provider key is invalid, quota is exhausted, provider times out, or the model is wrong.
2. System shows a clear user-facing error and preserves the user's form input.
3. System can still create a demo kit and include fallback GitHub search URLs.
4. Coding agent uses repo URLs as inspiration only and does not clone automatically.

## Template-Specific Flow
1. Produce or review content plan.
2. Produce or review video scripts.
3. Produce or review shot lists.
4. Produce or review ai video prompts.
5. Produce or review caption variants.
