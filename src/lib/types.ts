export type WorkflowFile = {
  filename: string;
  workflow: Workflow;
};

export type Workflow = {
  name?: string;
  jobs: Record<string, Job>;
};

export type Job = {
  name?: string;
  needs?: string | string[];
  steps?: Step[];
  permissions?: Permissions;
  "runs-on"?: string | string[];
  "timeout-minutes"?: number;
  environment?: string | { name: string; url?: string };
  concurrency?: { group: string; "cancel-in-progress"?: boolean };
  outputs?: Record<string, string>;
};

export type Permissions = Record<string, "read" | "write" | "none">;

type StepBase = {
  id?: string;
  name?: string;
  env?: Record<string, unknown>;
};

type RunStep = StepBase & {
  run: string;
};

type UsesStep = StepBase & {
  uses: string;
  with?: Record<string, unknown>;
};

export type Step = RunStep | UsesStep;
