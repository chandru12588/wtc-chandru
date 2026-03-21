import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminRaw = localStorage.getItem("admin");
  const admin = adminRaw ? JSON.parse(adminRaw) : null;
  const adminEmailList = (
    import.meta.env.VITE_ADMIN_EMAILS ||
    "admin@trippolama.com,chandru.balasub12588@gmail.com"
  )
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const isAllowedAdmin = adminEmailList.includes(admin?.email?.toLowerCase() || "");

  if (!adminToken || !isAllowedAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
