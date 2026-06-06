# Roadmap

## Now: Demo/Launch Readiness

- Keep `/` as the usable builder.
- Keep demo generation deterministic and no-key.
- Maintain Markdown, JSON, ZIP, and agent-pack exports.
- Verify project history, project detail, section copy, section regenerate, provider settings, MCP connections, and AI video repo recommendations.
- Keep docs current: README, PRODUCT_AUDIT, PRODUCT_STRUCTURE, REPO_MAP, AGENT_KIT, MEMORY_DESIGN, UPGRADE_REPORT, DEPLOY_REPORT.

## Next: Public Beta Quality

- Add stronger Playwright coverage for dashboard, agent kit, exports, settings, MCP, and repo map.
- Add persisted toast/error history for failed provider runs.
- Add downloadable `repo-map.json` from the UI.
- Add route-level skeletons for project history and repo map.
- Add project import/export from JSON.

## Later: Production Layer

- Harden Supabase RLS tests for project kits, provider profiles, generation logs, and MCP connections.
- Move production provider keys fully into server-side vault flows.
- Add usage metering and cost ceilings for provider-backed generation.
- Add observability for generation failures and latency.
- Add account-level project memory with user-controlled deletion.

## Not Yet

- Billing, teams, marketplace, and background job queues.
- Automatic repo cloning.
- Executing user-supplied code.
- Mandatory API keys for the core flow.
