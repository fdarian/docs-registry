import { Schema } from "effect"
import { Context, Effect } from "effect"
import { RegistryEntry } from "@docs-registry/core"

export class RegistryNotFoundError extends Schema.TaggedError<RegistryNotFoundError>()(
	"RegistryNotFoundError",
	{
		type: Schema.String,
		name: Schema.String,
	},
) {}

export class RegistrySource extends Context.Tag("RegistrySource")<
	RegistrySource,
	{
		readonly get: (
			type: string,
			name: string,
		) => Effect.Effect<typeof RegistryEntry.Type, RegistryNotFoundError>
		readonly search: (
			name: string,
		) => Effect.Effect<typeof RegistryEntry.Type, RegistryNotFoundError>
	}
>() {}
