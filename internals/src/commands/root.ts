import { Command } from "@effect/cli";
import { getCmd } from "#src/commands/get.ts";

const rootBase = Command.make("docslib-in");

export const rootCmd = rootBase.pipe(Command.withSubcommands([getCmd]));
