import { CodeHighlight } from "@mantine/code-highlight";
import { Accordion, Anchor, Box, Text } from "@mantine/core";
import type { Job } from "../../../lib/types";
import { KeyValueTable } from "./KeyValueTable";

export type JobStepsAccordionProps = {
  job: Job;
};

type RemoteAction = {
  action: string; // e.g., "actions/checkout" or "actions/checkout/subdir"
  ref: string; // e.g., "v5.0.0"
  repoUrl: string; // e.g., "https://github.com/actions/checkout"
};

function parseRemoteAction(uses: string): RemoteAction | null {
  // Local action check
  if (uses.startsWith(".")) {
    return null;
  }

  const match = uses.match(/^([^@]+)@(.+)$/);
  if (!match || match.length < 3) {
    return null;
  }

  const action = match[1];
  const ref = match[2];

  if (!action || !ref) {
    return null;
  }

  // Extract owner/repo for the URL
  const repoMatch = action.match(/^([^/]+\/[^/]+)/);
  if (!repoMatch || !repoMatch[1]) {
    return null;
  }

  return {
    action,
    ref,
    repoUrl: `https://github.com/${repoMatch[1]}`,
  };
}

export default function JobStepsAccordion({ job }: JobStepsAccordionProps) {
  return (
    <Accordion className="border border-gray-200" multiple variant="default">
      {job.steps?.map((step, i) => {
        const remoteAction =
          "uses" in step ? parseRemoteAction(step.uses) : null;
        const hasContent =
          ("run" in step && step.run) ||
          ("uses" in step && (remoteAction || step.with || step.env)) ||
          step.env;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: ignore
          <Accordion.Item key={i} value={String(i)}>
            <Accordion.Control className="">
              {step.name ?? (
                <Text lineClamp={1}>
                  {"run" in step && step.run}
                  {"uses" in step && step.uses}
                </Text>
              )}
            </Accordion.Control>
            <Accordion.Panel>
              <Box className="flex flex-col gap-4">
                {"uses" in step && (
                  <>
                    {/* Action info section (only for remote actions) */}
                    {(() => {
                      const remoteAction = parseRemoteAction(step.uses);
                      return (
                        remoteAction && (
                          <Box>
                            <Text className="text-sm font-bold mb-2">
                              Action
                            </Text>
                            <Box className="flex flex-col px-2.5">
                              <Box className="flex items-center gap-2">
                                <Anchor
                                  className="text-sm font-mono"
                                  href={remoteAction.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {remoteAction.action}
                                </Anchor>
                                <Text className="text-xs font-mono">
                                  ({remoteAction.ref})
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        )
                      );
                    })()}

                    {/* Inputs section */}
                    {step.with && (
                      <Box>
                        <Text className="text-sm font-bold mb-2">Inputs</Text>
                        <KeyValueTable data={step.with} />
                      </Box>
                    )}

                    {/* Environment variables section */}
                    {step.env && (
                      <Box>
                        <Text className="text-sm font-bold mb-2">
                          Environment Variables
                        </Text>
                        <KeyValueTable data={step.env} />
                      </Box>
                    )}
                  </>
                )}

                {"run" in step && (
                  <>
                    {/* Code section */}
                    <Box>
                      {/* TODO: Change language depending on shell input */}
                      <CodeHighlight language="shell" code={step.run} />
                    </Box>

                    {/* Environment variables section for run steps */}
                    {step.env && (
                      <Box>
                        <Text className="text-sm font-bold mb-2">
                          Environment Variables
                        </Text>
                        <KeyValueTable data={step.env} />
                      </Box>
                    )}
                  </>
                )}

                {/* Empty state */}
                {!hasContent && (
                  <Text className="text-sm text-gray-500 italic">
                    No additional configuration for this step.
                  </Text>
                )}
              </Box>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
