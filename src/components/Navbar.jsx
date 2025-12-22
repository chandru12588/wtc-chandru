import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Home, Compass, User } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));

    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  if (isAdminPage) return null;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-white/70 backdrop-blur-md
          border-b border-white/40
          transition-all duration-300
          ${scrolled ? "h-[56px] shadow-md" : "h-[64px]"}
        `}
      >
        <nav className="w-full h-full px-6 flex items-center">

          {/* LEFT — LOGO (NO GAP, NO JUMP) */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className={`
                object-contain transition-all duration-300
                ${scrolled ? "h-9" : "h-11"}
                drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]
                hover:scale-110
              `}
            />
          </Link>

          {/* RIGHT — MENU */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">

            {/* Home + Campfire */}
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

              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-orange-400 blur-md opacity-0 group-hover:opacity-100 transition" />
                <CampfireAnimated size={26} />
              </div>
            </div>

            <NavLink to="/trips" className="hover:text-emerald-600">
              Trips
            </NavLink>

            {/* Host dropdown */}
            <div className="relative">
              <button
                onClick={() => setHostMenuOpen(!hostMenuOpen)}
                className="flex items-center gap-1 border px-4 py-1.5 rounded-full text-xs hover:bg-white"
              >
                Become a Host <ChevronDown size={14} />
              </button>

              {hostMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden">
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
                <Link to="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs">
                  Login
                </Link>
                <Link to="/admin/login" className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs">
                  Admin
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs">
                Logout
              </button>
            )}

            {/* Campfire People Image */}
            <img
              src={cammp1}
              alt="Campers"
              className="h-10 w-10 rounded-full ring-2 ring-orange-300 shadow-md hover:scale-110 transition"
            />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="ml-auto md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      {/* ================= MOBILE SIDE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[85%] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={26} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-base font-medium">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>🏠 Home</NavLink>
              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>🧭 Trips</NavLink>
              <NavLink to="/host/register" onClick={() => setMobileOpen(false)}>🏕 Become a Host</NavLink>
              <NavLink to="/host/login" onClick={() => setMobileOpen(false)}>🔑 Host Login</NavLink>
            </div>
          </div>
        </div>
      )}

      {/* SPACER (prevents content jump) */}
      <div className="h-[64px]" />
    </>
  );
}
