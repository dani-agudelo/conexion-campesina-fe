import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import LoginPage from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import RegisterPage from "./pages/Register";
import CatalogPage from "./pages/CatalogProducts";
import InventoryPage from "./pages/inventory/Inventory";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ClientLayout } from "./layouts/ClientLayout";
import { ProducerLayout } from "./layouts/ProducerLayout";
import { UserRole } from "./types/enums";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { UsersPage } from "./pages/Users/Users";
import { ProfilePage } from "./pages/Profile/Profile";
import ProductsPage from "./pages/ProducerProducts/ProductsPage";
import OrdersPage from "./pages/ProducerProducts/OrdersPage";
import ClientOrdersTable from "./components/client/ClientOrdersTable";
import { Navbar } from "./components/ui/navbar/Navbar";
import PaymentSuccessPage from "./pages/PaymentSuccess/PaymentSuccess";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/payment/success",
            element: <PaymentSuccessPage />, // No necesita ProtectedRoute
          },
          {
            path: "/users",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <UsersPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/profile",
        element: (
          <>
            <Navbar />
            <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.PRODUCER]}>
              <ProfilePage />
            </ProtectedRoute>
          </>
        ),
      },
      {
        element: <ProducerLayout />,
        children: [
          {
            path: "/product-management/products",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PRODUCER]}>
                <ProductsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/product-management/orders",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PRODUCER]}>
                <OrdersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/product-management",
            element: <Navigate to="/product-management/products" replace />,
          },
        ],
      },

      {
        element: <ClientLayout />,
        children: [
          {
            path: "/product/:productId",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                <ProductDetail />
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
            path: "/client-orders",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
                <ClientOrdersTable />
              </ProtectedRoute>
            ),
          },
          {
            path: "/product-management/inventory",
            element: (
              <ProtectedRoute allowedRoles={[UserRole.PRODUCER]}>
                <InventoryPage />   {/* tu componente */}
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: "/", element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
