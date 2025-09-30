import { Box, Drawer, Text } from "@mantine/core";
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
        {/* TODO: meta */}
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
