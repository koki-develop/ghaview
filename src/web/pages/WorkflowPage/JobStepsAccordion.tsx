import { CodeHighlight } from "@mantine/code-highlight";
import { Accordion, Text } from "@mantine/core";
import type { Job } from "../../../lib/types";
import { KeyValueTable } from "./KeyValueTable";

export type JobStepsAccordionProps = {
  job: Job;
};

export default function JobStepsAccordion({ job }: JobStepsAccordionProps) {
  return (
    <Accordion className="border border-gray-200" multiple variant="default">
      {job.steps?.map((step, i) => (
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
            {"run" in step && (
              // TODO: Change language depending on shell input
              <CodeHighlight language="shell" code={step.run} />
            )}
            {"uses" in step && (
              <>
                {step.with && (
                  <div>
                    <Text className="text-sm font-bold">Inputs</Text>
                    <KeyValueTable data={step.with} />
                  </div>
                )}

                {step.env && (
                  <div>
                    <Text className="text-sm font-bold">
                      Environment Variables
                    </Text>
                    <KeyValueTable data={step.env} />
                  </div>
                )}
              </>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
