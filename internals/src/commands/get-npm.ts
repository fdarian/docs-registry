import { Args, Command } from "@effect/cli";
import { HttpClient } from "@effect/platform";
import { Console, Effect, Schema } from "effect";

const packageName = Args.text({ name: "package-name" });

const NpmRepository = Schema.Union(
	Schema.String,
	Schema.Struct({ url: Schema.String }),
);

const NpmPackageInfo = Schema.Struct({
	repository: Schema.optional(NpmRepository),
	homepage: Schema.optional(Schema.String),
	readme: Schema.optional(Schema.String),
});

export const getNpmCmd = Command.make("npm", { packageName }, (args) =>
	Effect.gen(function* () {
		const client = yield* HttpClient.HttpClient;
		const response = yield* client
			.get(`https://registry.npmjs.org/${args.packageName}`)
			.pipe(Effect.flatMap((r) => r.json));

		const info = yield* Schema.decodeUnknown(NpmPackageInfo)(response);

		const repository = info.repository
			? typeof info.repository === "string"
				? info.repository
				: info.repository.url
			: null;

		const result = {
			repository,
			homepage: info.homepage ?? null,
			readme: info.readme ?? null,
		};

		yield* Console.log(JSON.stringify(result, null, "\t"));
	}),
);
