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
    setMobileOpen(false);
    navigate("/");
  };

  if (isAdminPage) return null;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">

          {/* ================= LEFT — LOGO (3D EFFECT) ================= */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className="
                h-18 w-auto
                drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]
                hover:drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]
                hover:-translate-y-[1px]
                hover:scale-105
                transition-all duration-300
              "
            />
          </Link>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200"
          >
            <Menu size={28} />
          </button>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">

            {/* Home + Campfire Animation */}
            <div className="flex items-center gap-1">
              <NavLink to="/" className="hover:text-emerald-600">
                Home
              </NavLink>
              <CampfireAnimated size={28} />
            </div>

            <NavLink to="/trips" className="hover:text-emerald-600">
              Trips
            </NavLink>

            {user && (
              <NavLink to="/my-bookings" className="hover:text-emerald-600">
                My Bookings
              </NavLink>
            )}

            {/* Host Menu */}
            <div className="relative">
              <button
                onClick={() => setHostMenuOpen(!hostMenuOpen)}
                className="flex items-center gap-1 border px-4 py-1 rounded-full text-xs hover:bg-gray-100"
              >
                Become a Host <ChevronDown size={14} />
              </button>

              {hostMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg">
                  <Link to="/host/register" className="block px-3 py-2 hover:bg-gray-100">
                    Host Register
                  </Link>
                  <Link to="/host/login" className="block px-3 py-2 hover:bg-gray-100">
                    Host Login
                  </Link>
                </div>
              )}
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">

              {/* Campfire People Image */}
              <img
                src={cammp1}
                alt="Campfire Community"
                className="h-18 w-9 rounded-full object-cover"
              />

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs hover:bg-emerald-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/admin/login"
                    className="bg-gray-700 text-white px-4 py-1.5 rounded-full text-xs hover:bg-gray-800"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

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

            <div className="p-5 space-y-4 text-base font-medium">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>🏠 Home</NavLink>
              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>🧭 Trips</NavLink>

              {user && (
                <NavLink to="/my-bookings" onClick={() => setMobileOpen(false)}>
                  📑 My Bookings
                </NavLink>
              )}

              <div className="border-t pt-3 text-xs text-gray-400">HOST</div>

              <NavLink to="/host/register" onClick={() => setMobileOpen(false)}>
                🏕 Become a Host
              </NavLink>

              <NavLink to="/host/login" onClick={() => setMobileOpen(false)}>
                🔑 Host Login
              </NavLink>

              <div className="border-t pt-4">
                {!user ? (
                  <>
                    <Link to="/login" className="block text-center bg-emerald-600 text-white py-3 rounded-lg">
                      Login
                    </Link>
                    <Link to="/admin/login" className="block text-center bg-gray-800 text-white py-3 rounded-lg mt-2">
                      Admin
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 rounded-lg">
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
