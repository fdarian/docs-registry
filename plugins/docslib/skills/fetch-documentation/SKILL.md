---
name: fetch-documentation
description: Fetch documentation for a library or tool. Use when you need to look up docs for a package seen in imports, package.json, or mentioned by the user.
---

## Docs Registry

This project maintains a **Registry** of documentation sources. Each **Entry** is a JSON file containing where to find docs for a given library.

### Finding an Entry

Identify the library (e.g. from `import {} from 'effect'`, `package.json` dependencies, or user mention), then call the `get-docs` MCP tool:

- `query`: the library name (e.g. `effect`, `react`)
- `type` (optional): the registry type (e.g. `npm`, `name`)

### Entry Structure

Each Entry has a `sources` array:

```json
{
  "sources": [
    {
      "type": "website",
      "url": "https://effect.website/docs",
      "llmsTxtUrl": "https://effect.website/llms.txt"
    },
    { "type": "repository", "url": "https://github.com/Effect-TS" }
  ]
}
```

### Fetching Documentation

1. **If the source has `llmsTxtUrl`** — fetch it first. This is a table of contents for the docs.
   - When fetching, make sure the response includes the links listed so you can follow them.
   - If the links in `llms.txt` end with `.md` (or `.mdx`), keep using that format for all subsequent links under that domain.

2. **Follow links** from `llms.txt` to read the specific doc pages you need.

### Searching Documentation

When searching for information about a library that has an Entry:

- Prefer searching the documentation site over generic web search.
- Add **all URLs** from the Entry's sources to `allowed_domains` when calling the WebSearch tool, so results are scoped to official docs and repos.
