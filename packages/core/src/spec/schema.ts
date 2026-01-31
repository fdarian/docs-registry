import { Schema } from "effect";

export const WebsiteSource = Schema.Struct({
	type: Schema.Literal("website"),
	url: Schema.String,
	llmsTxtUrl: Schema.optional(Schema.String),
});

export const RepositorySource = Schema.Struct({
	type: Schema.Literal("repository"),
	url: Schema.String,
});

export const Source = Schema.Union(WebsiteSource, RepositorySource);

export const RegistryEntry = Schema.Struct({
	sources: Schema.Array(Source),
});
