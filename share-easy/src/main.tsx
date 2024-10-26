import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Dashboard from "./Pages/dashboad/index.tsx";
// import App from "./App.tsx";
import "./index.css";

// Create a client
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    // loader: <div>Loading</div>,
   
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
      {/* <App /> */}
    </QueryClientProvider>
  </StrictMode>
);
