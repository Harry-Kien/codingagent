# UI_SCREENS.md

## Screen: / — Landing / Intake
Primary job: welcome Small shop owners, local retailers, Shopee/TikTok Shop sellers and capture their input for AI video app.
Key controls: input form with fields specific to AI video app, demo/sample button, submit button.

Acceptance criteria:
- Small shop owners, local retailers, Shopee/TikTok Shop sellers can start in under 30 seconds.
- Demo mode works without any setup.
- Loading state shows progress clearly.
- Error messages explain what went wrong and what to do next.

## Screen: /preview/[id] — Output Preview
Primary job: show the generated 30-second product showcase videos with text overlays, background music, and transitions with options to download, share, or regenerate.
Key panels: output preview area, download button, share button, edit/regenerate controls.

Acceptance criteria:
- Output is displayed immediately when ready.
- Download works in all major browsers.
- User can request regeneration with different options.

## Screen: /history — Past Outputs
Primary job: show all previously generated outputs with search and filters.

## Screen: /settings — Configuration
Primary job: configure AI provider (optional), account settings, and preferences.

## Responsive Rules
- Mobile-first layout for Small shop owners, local retailers, Shopee/TikTok Shop sellers who may use phones.
- Key actions (submit, download, share) are always visible.
- Form inputs stack cleanly on small screens.
