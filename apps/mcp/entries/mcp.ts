#!/usr/bin/env bun

import { Command } from "@effect/cli";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Effect } from "effect";
import { createServer } from "../src/server.ts";
import * as BunContext from '@effect/platform-bun/BunContext'
import * as BunRuntime from '@effect/platform-bun/BunRuntime'

export const cli = Command.run(
	Command.make("docslib-mcp").pipe(
		Command.withSubcommands([
			Command.make("start", {}, () =>
				Effect.gen(function* () {
					const server = createServer();
					const transport = new StdioServerTransport();
					yield* Effect.promise(() => server.connect(transport));
				}),
			),
		]),
	),
	{
		name: "docslib-mcp",
		version: "0.0.0",
	},
);

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
