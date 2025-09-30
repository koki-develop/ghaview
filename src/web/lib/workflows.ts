import { useQuery } from "@tanstack/react-query";
import type { Workflow, WorkflowFile } from "../../lib/types";

export function useWorkflowFiles() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const response = await fetch("/api/workflows");
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch workflows: ${text}`);
      }

      const json = await response.json();
      return json as WorkflowFile[];
    },
  });
}

export function useWorkflow(filename: string) {
  return useQuery({
    queryKey: ["workflow", filename],
    queryFn: async () => {
      const response = await fetch(`/api/workflows/${filename}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch workflow: ${text}`);
      }

      const json = await response.json();
      return json as Workflow;
    },
  });
}
