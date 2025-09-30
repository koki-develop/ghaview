import { Box, Code, Drawer, Text } from "@mantine/core";
import type { Job } from "../../../lib/types";
import JobStepsAccordion from "./JobStepsAccordion";
import { KeyValueTable } from "./KeyValueTable";

export type JobDrawerProps = {
  open: boolean;
  onClose: () => void;
  jobId: string;
  job: Job;
};

export default function JobDrawer({
  open,
  onClose,
  jobId,
  job,
}: JobDrawerProps) {
  const metadata: Record<string, unknown> = {};
  if (job["runs-on"] != null) {
    metadata["runs-on"] = job["runs-on"];
  }
  if (job["timeout-minutes"] != null) {
    metadata["timeout-minutes"] = job["timeout-minutes"];
  }

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      size="xl"
      position="right"
      title={
        job.name ? (
          <Box className="flex gap-2 items-center">
            <Text className="font-bold">{job.name}</Text>
            <Text className="text-sm text-gray-500">{jobId}</Text>
          </Box>
        ) : (
          <Text className="font-bold">{jobId}</Text>
        )
      }
    >
      <Box className="flex flex-col gap-4">
        {/* Job metadata */}
        {Object.keys(metadata).length > 0 && (
          <Box>
            <Text className="font-bold text-sm mb-2">General</Text>
            <KeyValueTable data={metadata} />
          </Box>
        )}

        {job.environment && (
          <Box>
            <Text className="font-bold text-sm mb-2">Environment</Text>
            {typeof job.environment === "string" ? (
              <Code>{job.environment}</Code>
            ) : (
              <KeyValueTable data={job.environment} />
            )}
          </Box>
        )}

        {job.concurrency && (
          <Box>
            <Text className="font-bold text-sm mb-2">Concurrency</Text>
            <KeyValueTable data={job.concurrency} />
          </Box>
        )}

        {job.outputs && (
          <Box>
            <Text className="font-bold text-sm mb-2">Outputs</Text>
            <KeyValueTable data={job.outputs} />
          </Box>
        )}

        {job.permissions && (
          <Box>
            <Text className="font-bold text-sm mb-2">Permissions</Text>
            <KeyValueTable data={job.permissions} />
          </Box>
        )}

        {/* steps */}
        <Box>
          <Text className="font-bold text-sm mb-2">Steps</Text>
          <JobStepsAccordion job={job} />
        </Box>
      </Box>
    </Drawer>
  );
}
