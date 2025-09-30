import { Center, Loader, Text } from "@mantine/core";
import clsx from "clsx";
import { Link, Outlet, useParams } from "react-router";
import { useWorkflowFiles } from "../lib/workflows";

export default function Layout() {
  const { workflow } = useParams<{ workflow: string }>();
  const { data: workflowFiles, isLoading, error } = useWorkflowFiles();

  return (
    <div className="flex max-h-dvh">
      <div className="overflow-y-auto min-h-dvh flex flex-col w-56 border-r border-gray-200">
        {isLoading && (
          <Center className="p-4">
            <Loader size="sm" />
          </Center>
        )}

        {error && (
          <span className="p-4 text-sm text-red-600">{error.message}</span>
        )}

        {!isLoading && !error && (
          <>
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

            {workflowFiles?.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                No workflows found.
              </div>
            )}
          </>
        )}
      </div>

      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}
