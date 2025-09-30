import path from "node:path";
import { fileURLToPath } from "node:url";
import open from "open";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";
  const rootDir = isDev
    ? path.resolve(__dirname, "..")
    : path.resolve(__dirname, "./web");

  // Start Vite server
  const server = await createServer({
    configFile: path.resolve(rootDir, "vite.config.ts"),
    root: rootDir,
  });
  await server.listen();

  const url = "http://localhost:3000";
  console.log(`Server started at ${url}`);
  await open(url);

  // Handle graceful shutdown
  async function shutdown() {
    console.log("Shutting down server...");
    await server.close();
  }
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
