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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-md">
        <nav className="max-w-7xl mx-auto h-[72px] px-6 flex items-center">

          {/* LEFT — WRONGTURN LOGO (3D) */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className="
                h-18 object-contain
                transition-all duration-300
                drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]
                hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.45)]
                hover:-translate-y-1 hover:scale-105
              "
            />
          </Link>

          {/* RIGHT — MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">

            {/* Home + Campfire (3D Glow) */}
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-emerald-600 font-semibold"
                    : "hover:text-emerald-600 transition"
                }
              >
                Home
              </NavLink>

              <div
                className="
                  transition-all duration-300
                  drop-shadow-[0_4px_10px_rgba(255,120,0,0.6)]
                  hover:drop-shadow-[0_10px_25px_rgba(255,120,0,0.9)]
                  hover:scale-110
                "
              >
                <CampfireAnimated size={28} />
              </div>
            </div>

            <NavLink
              to="/trips"
              className={({ isActive }) =>
                isActive
                  ? "text-emerald-600 font-semibold"
                  : "hover:text-emerald-600 transition"
              }
            >
              Trips
            </NavLink>

            {user && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  isActive
                    ? "text-emerald-600 font-semibold"
                    : "hover:text-emerald-600 transition"
                }
              >
                My Bookings
              </NavLink>
            )}

            {/* HOST DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setHostMenuOpen(!hostMenuOpen)}
                className="
                  flex items-center gap-1 border px-4 py-1.5 rounded-full text-xs
                  transition hover:shadow-md hover:-translate-y-[1px]
                "
              >
                Become a Host <ChevronDown size={14} />
              </button>

              {hostMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl overflow-hidden">
                  <Link to="/host/register" className="block px-4 py-3 hover:bg-gray-100">
                    Host Register
                  </Link>
                  <Link to="/host/login" className="block px-4 py-3 hover:bg-gray-100">
                    Host Login
                  </Link>
                </div>
              )}
            </div>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="
                    bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs
                    transition hover:shadow-lg hover:-translate-y-[1px]
                  "
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="
                    bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs
                    transition hover:shadow-lg hover:-translate-y-[1px]
                  "
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

            {/* PEOPLE IMAGE (3D CARD EFFECT) */}
            <img
              src={cammp1}
              alt="Campers"
              className="
                h-18 w-10 rounded-full object-cover
                ring-2 ring-orange-300
                transition-all duration-300
                shadow-md hover:shadow-2xl
                hover:-translate-y-1 hover:scale-105
              "
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
      <div className="h-[72px]" />

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-[85%] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={26} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-base font-medium">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>🏠 Home</NavLink>
              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>🧭 Trips</NavLink>

              {user && (
                <NavLink to="/my-bookings" onClick={() => setMobileOpen(false)}>
                  📑 My Bookings
                </NavLink>
              )}

              <div className="border-t pt-4 text-xs text-gray-400">HOST</div>

              <NavLink to="/host/register" onClick={() => setMobileOpen(false)}>
                🏕 Become a Host
              </NavLink>
              <NavLink to="/host/login" onClick={() => setMobileOpen(false)}>
                🔑 Host Login
              </NavLink>

              <div className="border-t pt-4 space-y-3">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center bg-emerald-600 text-white py-3 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center bg-gray-800 text-white py-3 rounded-lg"
                    >
                      Admin
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white py-3 rounded-lg"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
