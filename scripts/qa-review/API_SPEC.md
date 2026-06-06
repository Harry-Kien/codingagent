# API_SPEC.md

## API Contract Principles
All API routes must validate input with Zod, return structured user-facing errors, apply rate limits before expensive calls, and never log secrets.

## POST /api/process
Purpose: Process user input and generate 30-second product showcase videos with text overlays, background music, and transitions.

Request body:
```json
{
  "title": "string",
  "description": "string",
  "targetAudience": "string",
  "style": "string",
  "options": {}
}
```

Response body:
```json
{
  "id": "output_xxx",
  "status": "processing | complete | failed",
  "result": {},
  "previewUrl": "string",
  "downloadUrl": "string"
}
```

Error cases:
- 400 invalid_request — missing required fields
- 413 file_too_large — upload exceeds size limit
- 429 rate_limited — too many requests
- 500 processing_failed — generation error

Files to implement:
- src/app/api/process/route.ts
- src/lib/processor.ts
- src/lib/validation.ts

## POST /api/generate
Purpose: AI-powered enhanced generation (uses configured provider).

Request body:
```json
{
  "inputId": "string",
  "mode": "fast | balanced | deep",
  "providerProfileId": "optional"
}
```

Response body:
```json
{
  "id": "gen_xxx",
  "result": {},
  "source": "demo | provider",
  "model": "optional model id"
}
```

Acceptance criteria:
- Demo mode works without any API keys.
- Provider mode falls back safely to demo output.
- API keys are never returned in responses.
- Invalid input returns a clear error message.

Test command:
```powershell
npm.cmd run lint
npm.cmd run build
```

## GET /api/outputs/[id]
Purpose: Retrieve a specific generated output.

Response body:
```json
{
  "id": "output_xxx",
  "title": "string",
  "result": {},
  "previewUrl": "string",
  "downloadUrl": "string",
  "createdAt": "string"
}
```

Acceptance criteria:
- Returns 404 for missing outputs.
- Includes preview and download URLs.
- Response is fast enough for polling.
