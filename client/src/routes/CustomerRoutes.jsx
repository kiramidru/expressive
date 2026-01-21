import { Outlet, Navigate } from "react-router-dom";

export default function CustomerRoutes({ role }) {
  if (role !== "CUSTOMER") return <Navigate to="/login" />;
  return <Outlet />;
}
