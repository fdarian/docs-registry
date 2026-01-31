import { Command } from "@effect/cli";
import { getNpmCmd } from "#src/commands/get-npm.ts";

const getBase = Command.make("get");

export const getCmd = getBase.pipe(Command.withSubcommands([getNpmCmd]));
