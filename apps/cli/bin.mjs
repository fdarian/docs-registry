#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { platform, arch } from "node:os";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const args = process.argv.slice(2);
const require = createRequire(import.meta.url);

function runSource() {
  const entry = resolve(dirname(fileURLToPath(import.meta.url)), "entries/cli.ts");
  try {
    execFileSync("bun", [entry, ...args], { stdio: "inherit" });
  } catch (e) {
    process.exit(e.status ?? 1);
  }
  process.exit(0);
}

let bin;
try {
  bin = require.resolve(`@docslib/cli-${platform()}-${arch()}`);
} catch {
  runSource();
}

try {
  execFileSync(bin, args, { stdio: "inherit" });
} catch {
  runSource();
}
