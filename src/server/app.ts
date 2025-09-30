import fs from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { parse as parseYaml } from "yaml";
import type { WorkflowFile } from "../lib/types";

function getWorkflowsDir(): string {
  return path.join(process.cwd(), ".github/workflows");
}

export function createApp(): Hono {
  const app = new Hono();

  app.get("/api/workflows", async (c) => {
    // Check if the workflows directory exists
    const workflowsDir = getWorkflowsDir();
    if (!fs.existsSync(workflowsDir)) {
      return c.json({ error: ".github/workflows directory not found" }, 404);
    }

    // List all YAML files in the workflows directory
    const entries = fs.readdirSync(workflowsDir);
    const workflowFiles = entries.filter(
      (entry) => entry.endsWith(".yml") || entry.endsWith(".yaml"),
    );

    // Read and parse each workflow file
    const workflows = await Promise.all(
      workflowFiles.map(async (filename): Promise<WorkflowFile> => {
        const filepath = path.join(workflowsDir, filename);
        const content = fs.readFileSync(filepath, "utf-8");
        const parsed = parseYaml(content);

        return { filename, workflow: parsed };
      }),
    );

    // Return the list of workflows
    return c.json(workflows);
  });

  app.get("/api/workflows/:workflow", async (c) => {
    // Check if the workflows directory exists
    const workflowsDir = getWorkflowsDir();
    if (!fs.existsSync(workflowsDir)) {
      return c.json({ error: ".github/workflows directory not found" }, 404);
    }
    const workflowFiles = fs.readdirSync(workflowsDir);

    // Check if the requested workflow file exists
    const { workflow } = c.req.param();
    if (!workflowFiles.includes(workflow)) {
      return c.json({ error: "Workflow not found" }, 404);
    }

    // Read and parse the requested workflow file
    const filepath = path.join(workflowsDir, workflow);
    const content = fs.readFileSync(filepath, "utf-8");
    const parsed = parseYaml(content);

    // Return the parsed workflow
    return c.json(parsed);
  });

  return app;
}
