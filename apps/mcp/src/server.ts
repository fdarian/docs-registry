import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	RegistrySource,
	RegistryNotFoundError,
	GitHubRegistrySourceLayer,
} from "@docslib/core";
import { FetchHttpClient } from "@effect/platform";
import { Effect } from "effect";
import { z } from "zod";

const toolParams = {
	query: z.string().describe("Library name to look up (e.g. 'effect', 'react')"),
	type: z
		.enum(["npm", "name"])
		.optional()
		.describe("Registry type to search in. If omitted, searches npm first then name"),
};

export function createServer() {
	const server = new McpServer({
		name: "docslib",
		version: "0.0.0",
	});

	server.tool(
		"get-docs",
		"Look up documentation sources for a library from the docs registry",
		toolParams,
		async (args) => {
			const program = Effect.gen(function* () {
				const registry = yield* RegistrySource;
				const entry = args.type
					? yield* registry.get(args.type, args.query)
					: yield* registry.search(args.query);
				return JSON.stringify(entry, null, "\t");
			}).pipe(
				Effect.provide(GitHubRegistrySourceLayer),
				Effect.provide(FetchHttpClient.layer),
			);

			try {
				const result = await Effect.runPromise(program);
				return { content: [{ type: "text" as const, text: result }] };
			} catch (error) {
				if (error instanceof RegistryNotFoundError) {
					return {
						content: [{ type: "text" as const, text: `Registry entry not found for "${args.query}"` }],
						isError: true,
					};
				}
				throw error;
			}
		},
	);

	return server;
}
