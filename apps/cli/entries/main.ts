import { Command } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { docsCmd } from "#/commands/index.ts";

export const cli = Command.run(docsCmd, {
	name: "docs",
	version: "0.0.0",
});

cli(process.argv).pipe(
	Effect.provide(BunContext.layer),
	BunRuntime.runMain,
);
