import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout";
import WorkflowPage from "./pages/WorkflowPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0, // Disable garbage collection for queries
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: null,
      },
      {
        path: "workflows/:workflow",
        element: <WorkflowPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default function App() {
  return (
    <MantineProvider>
      <ReactFlowProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ReactFlowProvider>
    </MantineProvider>
  );
}
