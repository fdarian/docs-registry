## Overview
- Monorepo for Docs Registry (hereinafter, "Registry")
- Registry for all documentation
- Built for AI agents
  - Helping them to find the documentation page(s) for specific a library
  - Agent can use skills to access the Registry

## Structure

- `packages/core` — Effect Schema definitions for registry entries (`RegistryEntry`, `Source`, etc.), registry source logic (GitHub/local), and JSON Schema generation script
- `apps/cli` — CLI tool to query the registry. Uses `@effect/cli`. Supports local filesystem and GitHub raw URL as registry sources
- `apps/mcp` — MCP stdio server exposing a `get-docs` tool for AI agents to query the registry
- `internals/` — Internal CLI tool (`docs-in`) for fetching package metadata from npm. Used by skills (e.g. `add-registry`) to automate registry entry creation
- `registry/` — JSON files storing documentation sources, organized as `registry/<type>/<name>.json`

## Bun
- We use Bun instead of Node.js.
- **Managing Package**: `bun install` (not `pnpm` or `npm`)
- **Runtime/Executing Code**: `bun <file>`, `bun run <script>`, or `bun -e "<code>"` (not `node` or `tsx`)
