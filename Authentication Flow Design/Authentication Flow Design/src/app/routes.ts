import { createBrowserRouter, redirect } from "react-router";
import AuthPage from "./pages/AuthPage";
import CustomerLayout from "./pages/customer/CustomerLayout";
import HomePage from "./pages/customer/HomePage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import InventoryPage from "./pages/admin/InventoryPage";

function requireAuth(role?: "customer" | "admin") {
  const stored = localStorage.getItem("ale_farms_user");
  if (!stored) return redirect("/");
  if (role === "admin") {
    const user = JSON.parse(stored);
    if (user.role !== "admin") return redirect("/customer");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
    loader: () => {
      const stored = localStorage.getItem("ale_farms_user");
      if (stored) {
        const user = JSON.parse(stored);
        return user.role === "admin" ? redirect("/admin") : redirect("/customer");
      }
      return null;
    },
  },
  {
    path: "/customer",
    Component: CustomerLayout,
    loader: () => requireAuth(),
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "order-confirmation", Component: OrderConfirmationPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    loader: () => requireAuth("admin"),
    children: [
      { index: true, Component: DashboardPage },
      { path: "orders", Component: OrderManagementPage },
      { path: "inventory", Component: InventoryPage },
    ],
  },
]);