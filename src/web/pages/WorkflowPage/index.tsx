import { Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Background,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { useParams } from "react-router";
import type { Job } from "../../../lib/types";
import { useWorkflow } from "../../lib/workflows";
import JobDrawer from "./JobDrawer";

function JobNode(props: {
  data: {
    jobId: string;
    job: Job;
    hasSourceHandle: boolean;
    hasTargetHandle: boolean;
  };
}) {
  console.log({ props });
  const { jobId, job, hasSourceHandle, hasTargetHandle } = props.data;
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

      {hasSourceHandle && (
        <Handle
          className="invisible"
          type="source"
          position={Position.Bottom}
        />
      )}
      {hasTargetHandle && (
        <Handle className="invisible" type="target" position={Position.Top} />
      )}
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

    const edges = Object.entries(workflow.jobs).flatMap(([jobId, job]) => {
      if (!job.needs) return [];
      const needsArray = Array.isArray(job.needs) ? job.needs : [job.needs];

      return needsArray.map((sourceJobId) => ({
        id: `${sourceJobId}-${jobId}`,
        source: sourceJobId,
        target: jobId,
        markerEnd: {
          type: MarkerType.Arrow,
        },
      }));
    });

    const nodes = Object.entries(workflow.jobs).map(([jobId, job], index) => ({
      id: jobId,
      type: "job",
      position: { x: 0, y: index * 80 },
      data: {
        jobId,
        job,
        hasSourceHandle: edges.some((edge) => edge.source === jobId),
        hasTargetHandle: edges.some((edge) => edge.target === jobId),
      },
    }));

    return { nodes, edges };
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
