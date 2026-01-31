import { Args, Command, Options } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { Console, Effect, Logger, LogLevel, Option } from "effect";
import { RegistrySource } from "#/registry-source.ts";
import { GitHubRegistrySourceLayer } from "#/registry-source-github.ts";
import { LocalRegistrySourceLayer } from "#/registry-source-local.ts";

const query = Args.text({ name: "query" });
const type = Options.optional(
	Options.choice("type", ["npm", "name"]).pipe(Options.withAlias("t")),
);
const verbose = Options.boolean("verbose").pipe(
	Options.withAlias("v"),
	Options.withDefault(false),
);
const source = Options.choice("source", ["base", "file"]).pipe(
	Options.withAlias("s"),
	Options.withDefault("base" as const),
);

export const docsCmd = Command.make(
	"docs",
	{ query, type, verbose, source },
	(args) => {
		const base = Effect.gen(function* () {
			const registry = yield* RegistrySource;
			const entry = Option.isSome(args.type)
				? yield* registry.get(args.type.value, args.query)
				: yield* registry.search(args.query);
			yield* Console.log(JSON.stringify(entry, null, "\t"));
		}).pipe(
			args.verbose
				? Effect.provide(Logger.minimumLogLevel(LogLevel.Debug))
				: (e) => e,
		);

		return args.source === "file"
			? base.pipe(Effect.provide(LocalRegistrySourceLayer))
			: base.pipe(
					Effect.provide(GitHubRegistrySourceLayer),
					Effect.provide(FetchHttpClient.layer),
				);
	},
);
