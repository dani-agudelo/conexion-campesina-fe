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
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { UserRole } from "./types/enums";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { UsersPage } from "./pages/Users/Users";
import { ProfilePage } from './pages/Profile/Profile';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ]
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/product-management",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.PRODUCER]}>
            <ProducerProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/catalog",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
            <CatalogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]} >
            <UsersPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.PRODUCER]}>
            <ProfilePage /> 
          </ProtectedRoute>
        )
      }
    ]
  },
  { path: "/", element: <Navigate to="/login" replace /> },


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
