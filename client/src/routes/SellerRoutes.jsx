import { Outlet, Navigate } from "react-router-dom";

export default function SellerRoutes({ role }) {
  if (role !== "SELLER") return <Navigate to="/login" />;
  return <Outlet />;
}
