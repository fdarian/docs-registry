import { join } from "path"

const repoRoot = join(import.meta.dir, "..")

const apps = ["cli", "mcp"]
const platforms = ["darwin-arm64", "darwin-x64", "linux-x64", "linux-arm64"]

for (const app of apps) {
	for (const platform of platforms) {
		const packageName = `@docslib/${app}-${platform}`
		const packageDir = join(
			repoRoot,
			"npm",
			"@docslib",
			`${app}-${platform}`
		)

		const pkgJson = await Bun.file(join(packageDir, "package.json")).json()
		const version = pkgJson.version

		const viewProc = Bun.spawn(["npm", "view", `${packageName}@${version}`, "version"], {
			stdio: ["inherit", "pipe", "pipe"],
		})
		const viewExit = await viewProc.exited
		if (viewExit === 0) {
			console.log(`${packageName}@${version} already published, skipping`)
			continue
		}

		const publishProc = Bun.spawn(["npm", "publish", "--access", "public"], {
			cwd: packageDir,
			stdio: ["inherit", "inherit", "inherit"],
		})

		const exitCode = await publishProc.exited
		if (exitCode !== 0) {
			throw new Error(
				`npm publish failed for ${app}-${platform} with exit code ${exitCode}`
			)
		}
	}
}

const changesetProc = Bun.spawn(["bunx", "changeset", "publish"], {
	cwd: repoRoot,
	stdio: ["inherit", "inherit", "inherit"],
})

const changesetExit = await changesetProc.exited
if (changesetExit !== 0) {
	throw new Error(
		`changeset publish failed with exit code ${changesetExit}`
	)
}
