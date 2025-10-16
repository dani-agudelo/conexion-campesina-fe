import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProducerProducts from "./pages/ProducerProducts";

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
    <CssBaseline enableColorScheme />
    <RouterProvider router={router} />
  </StrictMode>
);
