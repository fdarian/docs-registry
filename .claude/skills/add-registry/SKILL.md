---
name: add-registry
description: "Add a new npm package to the docs registry by fetching metadata and building sources"
args: package-name
---

## Add Registry Entry

### 1. Fetch package metadata

Run `bun internals/entries/cli.ts get npm <package-name>`. Returns JSON:

```json
{ "repository": "string | null", "homepage": "string | null", "readme": "string | null" }
```

### 2. Build the `sources` array

**Repository source** — if `repository` is not null:
- Clean the URL: strip `git+` prefix and `.git` suffix
- Add `{ "type": "repository", "url": "<cleaned-url>" }`

**Website source** — if `homepage` is not null AND it is not just the GitHub repository URL:
- Fetch `<homepage>/llms.txt` to check if it exists
- Verify the content is actually docs for this specific package (not a generic/unrelated site)
- Add `{ "type": "website", "url": "<homepage>" }`
- If the `llms.txt` fetch succeeded and is valid, include `"llmsTxtUrl": "<homepage>/llms.txt"` in the source object

### 3. Write the entry

- Target path: `registry/npm/<package-name>.json`
- If the file already exists, warn the user before overwriting
- Use tab indentation in the JSON output

```json
{
	"sources": [
		{ "type": "website", "url": "https://example.com/docs", "llmsTxtUrl": "https://example.com/llms.txt" },
		{ "type": "repository", "url": "https://github.com/org/repo" }
	]
}
```
