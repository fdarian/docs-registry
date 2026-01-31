import { Command } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { rootCmd } from "#src/commands/root.ts";

const cli = Command.run(rootCmd, {
	name: "docslib-in",
	version: "0.0.0",
});

cli(process.argv).pipe(
	Effect.provide(BunContext.layer),
	Effect.provide(FetchHttpClient.layer),
	BunRuntime.runMain,
);
