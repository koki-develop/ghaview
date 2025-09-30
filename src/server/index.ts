import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import open from "open";
import { createApp } from "./app";

const app = createApp();

// Production: Serve static files
const isProd = process.env.NODE_ENV === "production";
if (isProd) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, "./web");
  app.use("*", serveStatic({ root: distDir }));
  app.use("*", serveStatic({ root: distDir, path: "index.html" }));
}

export default app;

export async function startServer() {
  serve(app, (info) => {
    const url = `http://localhost:${info.port}`;
    console.log(`Server started at ${url}`);
    open(url);
  });
}
