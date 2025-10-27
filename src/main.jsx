import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from "@mui/material/CssBaseline";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProducerProducts from "./pages/ProducerProducts";
import CatalogPage from "./pages/CatalogProducts";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/product-management",
    element: <ProducerProducts />,
  },
  {
    path: "/catalog",
    element: <CatalogPage />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  }
  // {
  //   path: '*',
  //   element: <NotFoundPage />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
