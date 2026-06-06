# DATABASE_SCHEMA.md

## Local MVP Collections
```ts
projects: ProjectKit[]
providers: ProviderSettings[]
mcpConnections: McpConnection[]
```

## ProjectKit Shape
```ts
type ProjectKit = {
  id: string;
  name: string;
  input: ProjectInput;
  sections: Record<string, string>;
  favorites: Record<string, boolean>;
  repoRecommendations: RepoRecommendation[];
  readinessScore: ReadinessScore;
  generation?: GenerationMetadata;
  createdAt: string;
  updatedAt: string;
}
```

## Supabase Production Tables
| Table | Purpose | Key Columns |
|---|---|---|
| projects | Stores generated kits | id, user_id, name, input_json, sections_json, readiness_json, generation_json, created_at, updated_at |
| project_versions | Stores meaningful section snapshots | id, project_id, user_id, sections_json, label, created_at |
| provider_profiles | Stores provider metadata and encrypted keys | id, user_id, provider_name, provider_type, base_url, encrypted key fields |
| generation_logs | Tracks provider usage and failures | id, user_id, project_id, route, provider_name, model, generation_mode, status, error_message |
| mcp_connections | Stores external workflow configuration | id, user_id, name, type, command_or_url, env_vars, status |

## Acceptance Criteria
- Local mode works with no database.
- Cloud mode is owner-scoped with RLS.
- API keys are never stored in plaintext.
- Old local projects can still open after schema additions.
