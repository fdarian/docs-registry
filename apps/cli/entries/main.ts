import { Args, Command, Options } from "@effect/cli"
import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Console, Effect, Option } from "effect"
import { LocalRegistrySourceLayer } from "#/registry-source-local.js"
import { RegistrySource } from "#/registry-source.js"

const query = Args.text({ name: "query" })
const type = Options.optional(
	Options.choice("type", ["npm", "name"]).pipe(Options.withAlias("t")),
)

const command = Command.make("docs-registry", { query, type }, (args) =>
	Effect.gen(function* () {
		const source = yield* RegistrySource
		const entry = Option.isSome(args.type)
			? yield* source.get(args.type.value, args.query)
			: yield* source.search(args.query)
		yield* Console.log(JSON.stringify(entry, null, "\t"))
	}),
)

const cli = Command.run(command, {
	name: "docs-registry",
	version: "0.0.0",
})

cli(process.argv).pipe(
	Effect.provide(LocalRegistrySourceLayer),
	Effect.provide(BunContext.layer),
	BunRuntime.runMain,
)
