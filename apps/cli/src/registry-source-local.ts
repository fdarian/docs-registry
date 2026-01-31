import { RegistryEntry } from "@docs-registry/core";
import { FileSystem } from "@effect/platform";
import { Effect, Layer, Schema } from "effect";
import { RegistryNotFoundError, RegistrySource } from "#/registry-source.ts";

// Resolve repo root from this file's location (apps/cli/src/ -> repo root)
const registryDir = new URL("../../../registry", import.meta.url).pathname;

export const LocalRegistrySourceLayer = Layer.effect(
	RegistrySource,
	Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;

		const get = (type: string, name: string) =>
			Effect.gen(function* () {
				const filePath = `${registryDir}/${type}/${name}.json`;
				const content = yield* fs
					.readFileString(filePath)
					.pipe(
						Effect.mapError(() => new RegistryNotFoundError({ type, name })),
					);
				return yield* Schema.decode(Schema.parseJson(RegistryEntry))(content);
			});

		const search = (name: string) =>
			get("npm", name).pipe(
				Effect.catchTag("RegistryNotFoundError", () => get("name", name)),
			);

		return RegistrySource.of({ get, search });
	}),
);
