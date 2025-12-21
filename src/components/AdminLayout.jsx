import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===========================
          ADMIN SIDEBAR
      ============================ */}
      <div className="w-64 bg-white shadow-lg border-r p-4">

        <h2 className="text-xl font-bold mb-6 text-indigo-700">Admin Panel</h2>

        <nav className="flex flex-col space-y-2">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/packages"
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`
            }
          >
            Packages
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`
            }
          >
            Bookings
          </NavLink>

          {/* ⭐ ADDED: HOST LISTINGS MENU */}
          <NavLink
            to="/admin/host-listings"
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`
            }
          >
            Host Listings
          </NavLink>

          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white p-2 rounded-lg"
          >
            Logout
          </button>

          <a href="/" className="mt-4 text-indigo-600 underline text-center">
            ← Back to Home
          </a>
        </nav>
      </div>

      {/* ===========================
           MAIN ADMIN CONTENT
      ============================ */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}
