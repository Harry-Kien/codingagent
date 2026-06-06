# TASKS.md

## Phase 1: Working AI video app MVP

### Task 1: Build the AI video app intake form
Files:
- src/app/page.tsx
- src/components/ai-video-app/IntakeForm.tsx
- src/types/ai-video-app.ts

Implementation notes:
- Create a form for Small shop owners, local retailers, Shopee/TikTok Shop sellers to provide their input (title, description, target audience, style preferences).
- Keep defaults useful so users can submit with minimal input.
- Show a demo/sample button to pre-fill the form.

Acceptance criteria:
- Small shop owners, local retailers, Shopee/TikTok Shop sellers can submit the form with minimal required fields.
- Validation explains what is missing in clear language.
- Form works on mobile devices.

Test command:
```powershell
npm.cmd run lint
npm.cmd run build
```

### Task 2: Build the core processing pipeline
Files:
- src/app/api/process/route.ts
- src/lib/processor.ts
- src/lib/validation.ts

Implementation notes:
- Accept user input from the intake form.
- Process it into 30-second product showcase videos with text overlays, background music, and transitions using a deterministic demo pipeline first.
- Return a preview-ready result.

Acceptance criteria:
- API endpoint accepts valid input and returns structured output.
- Demo mode produces useful 30-second product showcase videos with text overlays, background music, and transitions without any API keys.
- Invalid input returns clear error messages.
- Processing completes in under 10 seconds for demo mode.

Test command:
```powershell
npm.cmd run lint
npm.cmd run build
```

### Task 3: Build the output preview and download page
Files:
- src/app/preview/[id]/page.tsx
- src/components/ai-video-app/OutputPreview.tsx
- src/components/ai-video-app/DownloadButton.tsx

Acceptance criteria:
- User can see their generated 30-second product showcase videos with text overlays, background music, and transitions immediately.
- Download button works in all major browsers.
- User can regenerate with different options.
- Empty and error states are handled gracefully.

Test command:
```powershell
npm.cmd run lint
npm.cmd run build
```

### Task 4: Build history and local storage
Files:
- src/app/history/page.tsx
- src/lib/storage.ts
- src/components/ai-video-app/HistoryList.tsx

Acceptance criteria:
- Past outputs are saved to localStorage.
- User can browse, search, and reopen past outputs.
- Old outputs still load after app updates.

## Phase 2: AI-Enhanced Generation
- Add AI provider integration for richer 30-second product showcase videos with text overlays, background music, and transitions.
- Add Fast/Balanced/Deep generation modes.
- Add structured errors and demo fallback when provider fails.

## Phase 3: Production Features
- Add user accounts and cloud storage.
- Add sharing and collaboration.
- Add usage analytics and rate limiting.

## Do Not Build Yet
- Payment processing before demand is proven.
- Team workspaces before single-user flow is solid.
- Automatic repo cloning or external code execution.
- Heavy video rendering pipelines before the core workflow proves useful.
