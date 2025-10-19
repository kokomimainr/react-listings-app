import { QueryProvider } from "./providers/query/QueryProvider";
import { RouterProvider } from "./providers/router/RouterProvider";

export function App() {
  return (
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  );
}
