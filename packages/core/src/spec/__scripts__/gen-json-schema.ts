import { JSONSchema, Schema } from "effect";
import { RegistryEntry } from "../schema.ts";

const jsonSchema = JSONSchema.make(Schema.encodedSchema(RegistryEntry));
const outPath = new URL("../schema.json", import.meta.url).pathname;

await Bun.write(outPath, `${JSON.stringify(jsonSchema, null, "\t")}\n`);

console.log(`Written to ${outPath}`);
