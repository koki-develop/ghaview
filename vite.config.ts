import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: "src/server/index.ts",
      exclude: [/^(?!\/api)/, ...defaultOptions.exclude],
    }),
  ],
  build: {
    outDir: "dist/web",
  },
  server: { port: 3000 },
});
