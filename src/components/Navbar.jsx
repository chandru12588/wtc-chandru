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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo3} className="h-19" />
            <CampfireAnimated size={40} />
            <img src={cammp1} className="h-18" />
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200"
          >
            <Menu size={28} />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/trips">Trips</NavLink>

            {user && (
              <NavLink to="/my-bookings">My Bookings</NavLink>
            )}

            {/* Host Menu */}
            <div className="relative">
              <button
                onClick={() => setHostMenuOpen(!hostMenuOpen)}
                className="flex items-center gap-1 border px-4 py-1 rounded-full text-xs"
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
                  className="bg-gray-700 text-white px-4 py-1.5 rounded-full text-xs"
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
          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="fixed right-0 top-0 h-full w-[85%] bg-white animate-slideIn shadow-xl overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={26} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-5 space-y-4 text-base font-medium">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>
                🏠 Home
              </NavLink>

              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>
                🧭 Trips
              </NavLink>

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
