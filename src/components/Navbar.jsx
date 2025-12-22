import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import cammp1 from "../assets/camp1.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hostMenuOpen, setHostMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  if (isAdminPage) return null;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <nav className="max-w-7xl mx-auto h-[70px] px-6 flex items-center gap-6">

          {/* LOGO — LEFT */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className="h-12 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]"
            />
          </Link>

          {/* MENU — STARTS IMMEDIATELY AFTER LOGO */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600 font-medium"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/trips"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600 font-medium"
            }
          >
            Trips
          </NavLink>

          {/* CAMPFIRE NEXT TO TRIPS */}
          <CampfireAnimated size={26} />

          {/* HOST DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setHostMenuOpen(!hostMenuOpen)}
              className="flex items-center gap-1 border px-4 py-1.5 rounded-full text-xs hover:bg-gray-50"
            >
              Become a Host <ChevronDown size={14} />
            </button>

            {hostMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden">
                <Link to="/host/register" className="block px-4 py-3 hover:bg-gray-100">
                  Host Register
                </Link>
                <Link to="/host/login" className="block px-4 py-3 hover:bg-gray-100">
                  Host Login
                </Link>
              </div>
            )}
          </div>

          {/* PUSH AUTH TO RIGHT */}
          <div className="ml-auto flex items-center gap-4">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs"
                >
                  Login
                </Link>

                <Link
                  to="/admin/login"
                  className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs"
                >
                  Admin
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs"
              >
                Logout
              </button>
            )}

            {/* PEOPLE IMAGE — RIGHT NEXT TO ADMIN */}
            <img
              src={cammp1}
              alt="Campers"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-300"
            />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      {/* HEADER SPACER */}
      <div className="h-[70px]" />
    </>
  );
}
