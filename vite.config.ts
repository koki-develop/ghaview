import devServer, { defaultOptions } from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    devServer({
      entry: "src/server.ts",
      exclude: [/^(?!\/api)/, ...defaultOptions.exclude],
    }),
  ],
  build: {
    outDir: "dist/web",
  },
  server: { port: 3000 },
});
