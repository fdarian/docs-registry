import { HttpClient } from "@effect/platform";
import { Effect, Layer, Schema } from "effect";
import { RegistryEntry } from "#src/spec/schema.ts";
import { RegistryNotFoundError, RegistrySource } from "#src/registry/source.ts";

const BASE_URL =
	"https://raw.githubusercontent.com/fdarian/docslib/refs/heads/main/registry";

export const GitHubRegistrySourceLayer = Layer.effect(
	RegistrySource,
	Effect.gen(function* () {
		const client = yield* HttpClient.HttpClient;

		const get = (type: string, name: string) =>
			Effect.gen(function* () {
				const url = `${BASE_URL}/${type}/${name}.json`;
				yield* Effect.logDebug("Fetching registry from GitHub").pipe(Effect.annotateLogs("url", url));
				const response = yield* client
					.get(url)
					.pipe(
						Effect.tapError((error) => Effect.logDebug("HTTP request failed").pipe(Effect.annotateLogs("error", String(error)))),
						Effect.mapError(() => new RegistryNotFoundError({ type, name })),
					);
				const text = yield* response.text.pipe(
					Effect.mapError(() => new RegistryNotFoundError({ type, name })),
				);
				return yield* Schema.decode(Schema.parseJson(RegistryEntry))(text).pipe(
					Effect.tapError((error) => Effect.logDebug("Schema decode failed").pipe(Effect.annotateLogs("error", String(error)))),
					Effect.mapError(() => new RegistryNotFoundError({ type, name })),
				);
			});

		const search = (name: string) =>
			get("npm", name).pipe(
				Effect.catchTag("RegistryNotFoundError", () => get("name", name)),
			);

		return RegistrySource.of({ get, search });
	}),
);
