import { Text } from "@mantine/core";
import clsx from "clsx";
import { Link, Outlet, useParams } from "react-router";
import { useWorkflowFiles } from "../lib/workflows";

export default function Layout() {
  const { workflow } = useParams<{ workflow: string }>();
  const { data: workflowFiles } = useWorkflowFiles();

  return (
    <div className="flex max-h-dvh">
      <div className="overflow-y-auto flex flex-col w-56 border-r border-gray-200">
        {workflowFiles?.map((workflowFile) => (
          <Link
            key={workflowFile.filename}
            to={`/workflows/${workflowFile.filename}`}
            className={clsx(
              "text-base py-2 px-4 text-black no-underline border-b border-gray-200",
              {
                "bg-gray-200 font-bold": workflowFile.filename === workflow,
              },
            )}
          >
            <Text lineClamp={1} className="text-base">
              {workflowFile.workflow.name ?? workflowFile.filename}
            </Text>
            <Text lineClamp={1} className="text-xs text-gray-500">
              {workflowFile.filename}
            </Text>
          </Link>
        ))}
      </div>

      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}
