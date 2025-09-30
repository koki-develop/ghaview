import fs from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { parse as parseYaml } from "yaml";
import type { WorkflowFile } from "../lib/types";

export function createApp(): Hono {
  const app = new Hono();

  app.get("/api/workflows", async (c) => {
    const workflowsDir = path.join(process.cwd(), ".github/workflows");
    if (!fs.existsSync(workflowsDir)) {
      return c.json([]);
    }

    const entries = fs.readdirSync(workflowsDir);
    const workflowFiles = entries.filter(
      (entry) => entry.endsWith(".yml") || entry.endsWith(".yaml"),
    );

    const workflows = await Promise.all(
      workflowFiles.map(async (filename): Promise<WorkflowFile> => {
        const filepath = path.join(workflowsDir, filename);
        const content = fs.readFileSync(filepath, "utf-8");
        const parsed = parseYaml(content);

        return { filename, workflow: parsed };
      }),
    );

    return c.json(workflows);
  });

  app.get("/api/workflows/:workflow", async (c) => {
    const { workflow } = c.req.param();
    const workflowsDir = path.join(process.cwd(), ".github/workflows");
    const filepath = path.join(workflowsDir, workflow);
    if (!fs.existsSync(filepath)) {
      return c.json({ error: "Workflow not found" }, 404);
    }

    const content = fs.readFileSync(filepath, "utf-8");
    const parsed = parseYaml(content);

    return c.json(parsed);
  });

  return app;
}
