import { Code, Table } from "@mantine/core";

export type KeyValueTableProps = {
  data: Record<string, unknown>;
};

export function KeyValueTable({ data }: KeyValueTableProps) {
  const stringify = (value: unknown) => {
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  };

  return (
    <Table className="w-fit text-sm">
      <Table.Tbody>
        {Object.entries(data).map(([key, value]) => (
          <Table.Tr key={key}>
            <Table.Td className="align-top italic">{key}</Table.Td>
            <Table.Td>
              <Code
                block={(() => {
                  return (
                    typeof value === "string" && value.split("\n").length > 1
                  );
                })()}
              >
                {stringify(value)}
              </Code>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
