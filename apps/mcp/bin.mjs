#!/bin/sh -
':'; /*-
test1=$(bun --version 2>&1) && exec bun "$0" "$@"
test2=$(node --version 2>&1) && exec node "$0" "$@"
exec printf '%s\n' "$test1" "$test2" 1>&2
*/
import { execFileSync } from "node:child_process";
import { platform, arch } from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const bin = require.resolve(`@docslib/mcp-${platform()}-${arch()}`);

try {
  execFileSync(bin, process.argv.slice(2), { stdio: "inherit" });
} catch (e) {
  process.exit(e.status ?? 1);
}
