export type WorkflowFile = {
  filename: string;
  workflow: Workflow;
};

export type Workflow = {
  name?: string;
  needs?: string[];
  jobs: Record<string, Job>;
};

export type Job = {
  name?: string;
  steps?: Step[];
  permissions?: Permissions;
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
