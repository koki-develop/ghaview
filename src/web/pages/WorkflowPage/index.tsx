import { Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Background, Panel, ReactFlow } from "@xyflow/react";
import { useParams } from "react-router";
import type { Job } from "../../../lib/types";
import { useWorkflow } from "../../lib/workflows";
import JobDrawer from "./JobDrawer";

function JobNode({
  data: { jobId, job },
}: {
  data: { jobId: string; job: Job };
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <button
        className="cursor-pointer p-2 bg-white border rounded shadow"
        type="button"
        onClick={open}
      >
        {job.name ?? jobId}
      </button>

      <JobDrawer open={opened} onClose={close} jobId={jobId} job={job} />
    </div>
  );
}

const nodeTypes = {
  job: JobNode,
};

export default function WorkflowPage() {
  const params = useParams();
  const workflowFile = params.workflow as string;
  const { data: workflow } = useWorkflow(workflowFile);

  const { nodes, edges } = (() => {
    if (!workflow) return { nodes: [], edges: [] };

    const nodes = Object.entries(workflow.jobs).map(([jobId, job], index) => ({
      id: jobId,
      type: "job",
      position: { x: 0, y: index * 80 },
      data: {
        jobId,
        job,
      },
    }));

    return { nodes, edges: [] };
  })();

  return (
    <div className="h-dvh">
      <ReactFlow
        key={workflowFile}
        fitView
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
      >
        <Background />
        {workflow && (
          <Panel
            className="shadow py-2 px-4 rounded bg-white border border-gray-200"
            position="top-left"
          >
            <Title order={2} size="h4">
              {workflow.name ?? workflowFile}
            </Title>
            {workflow.name && (
              <Text className="text-gray-500">
                .github/workflows/{workflowFile}
              </Text>
            )}
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
