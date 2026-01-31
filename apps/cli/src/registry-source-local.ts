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
		yield* Effect.logDebug("Local registry source").pipe(Effect.annotateLogs("registryDir", registryDir));

		const get = (type: string, name: string) =>
			Effect.gen(function* () {
				const filePath = `${registryDir}/${type}/${name}.json`;
				yield* Effect.logDebug("Reading registry file").pipe(Effect.annotateLogs("filePath", filePath));
				const content = yield* fs
					.readFileString(filePath)
					.pipe(
						Effect.tapError((error) => Effect.logDebug("File read failed").pipe(Effect.annotateLogs("error", String(error)))),
						Effect.mapError(() => new RegistryNotFoundError({ type, name })),
					);
				return yield* Schema.decode(Schema.parseJson(RegistryEntry))(content).pipe(
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
