import { useDisclosure } from "@mantine/hooks";
import { Handle, Position } from "@xyflow/react";
import type { Job } from "../../../lib/types";
import JobDrawer from "./JobDrawer";

export default function JobNode(props: {
  data: {
    jobId: string;
    job: Job;
    hasSourceHandle: boolean;
    hasTargetHandle: boolean;
  };
}) {
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
