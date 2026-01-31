import { join } from "path"
import { mkdirSync } from "fs"

const repoRoot = join(import.meta.dir, "..")

const app = process.argv[2]
if (app !== "cli" && app !== "mcp") {
	throw new Error(`Invalid app argument: ${app}. Must be "cli" or "mcp"`)
}

const packageJsonPath = join(repoRoot, "apps", app, "package.json")
const packageJson = await Bun.file(packageJsonPath).json()
const version = packageJson.version

const platforms: Array<[string, string]> = [
	["darwin", "arm64"],
	["darwin", "x64"],
	["linux", "x64"],
	["linux", "arm64"],
]

for (const [os, arch] of platforms) {
	const target = `bun-${os}-${arch}`
	const entryPath = join(repoRoot, "apps", app, "entries", `${app}.ts`)
	const outfile = join(repoRoot, "apps", app, "dist", `${app}-${os}-${arch}`)

	const buildProc = Bun.spawn(
		[
			"bun",
			"build",
			"--compile",
			`--target=${target}`,
			entryPath,
			`--outfile=${outfile}`,
		],
		{ cwd: repoRoot, stdio: ["inherit", "inherit", "inherit"] }
	)

	const exitCode = await buildProc.exited
	if (exitCode !== 0) {
		throw new Error(`Build failed for ${os}-${arch} with exit code ${exitCode}`)
	}

	const platformPackageDir = join(
		repoRoot,
		"npm",
		"@docslib",
		`${app}-${os}-${arch}`
	)

	mkdirSync(platformPackageDir, { recursive: true })

	const platformPackageJson = {
		name: `@docslib/${app}-${os}-${arch}`,
		version,
		main: "./bin",
		os: [os],
		cpu: [arch],
		files: ["bin"],
	}

	await Bun.write(
		join(platformPackageDir, "package.json"),
		JSON.stringify(platformPackageJson, null, "\t") + "\n"
	)

	await Bun.write(join(platformPackageDir, "bin"), Bun.file(outfile))
}
