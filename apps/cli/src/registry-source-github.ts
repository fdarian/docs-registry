import { RegistryEntry } from "@docs-registry/core";
import {
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "@effect/platform";
import { Effect, Layer, Schema } from "effect";
import { RegistryNotFoundError, RegistrySource } from "#/registry-source.ts";

const BASE_URL =
	"https://raw.githubusercontent.com/fdarian/docs-registry/refs/heads/main/registry";

export const GitHubRegistrySourceLayer = Layer.effect(
	RegistrySource,
	Effect.gen(function* () {
		const client = yield* HttpClient.HttpClient;

		const get = (type: string, name: string) =>
			Effect.gen(function* () {
				const url = `${BASE_URL}/${type}/${name}.json`;
				const response = yield* client
					.get(url)
					.pipe(
						Effect.mapError(() => new RegistryNotFoundError({ type, name })),
					);
				const text = yield* HttpClientResponse.text(response);
				return yield* Schema.decode(Schema.parseJson(RegistryEntry))(text);
			});

		const search = (name: string) =>
			get("npm", name).pipe(
				Effect.catchTag("RegistryNotFoundError", () => get("name", name)),
			);

		return RegistrySource.of({ get, search });
	}),
);
