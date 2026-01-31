import { join } from "path"

const repoRoot = join(import.meta.dir, "..")

const apps = ["cli", "mcp"]

for (const app of apps) {
	const packageJsonPath = join(repoRoot, "apps", app, "package.json")
	const packageJson = await Bun.file(packageJsonPath).json()
	const version = packageJson.version

	if (packageJson.optionalDependencies) {
		for (const dep of Object.keys(packageJson.optionalDependencies)) {
			packageJson.optionalDependencies[dep] = version
		}
	}

	await Bun.write(
		packageJsonPath,
		JSON.stringify(packageJson, null, "\t") + "\n"
	)
}
