import { $ } from "bun";

// Clean dist directory
await $`rm -rf dist`;

// Build CLI
await Bun.build({
  banner: "#!/usr/bin/env node",
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  packages: "external",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
await $`chmod +x ./dist/index.js`;

// Build React app
await $`bunx vite build`;
await $`mkdir -p dist/web`;
