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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  /* 🔥 LOGO PARALLAX */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
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
      {/* ================= GLASS HEADER ================= */}
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          bg-white/70 backdrop-blur-xl
          border-b border-white/40
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        "
      >
        <nav className="max-w-7xl mx-auto h-[72px] px-6 flex items-center">

          {/* LEFT — LOGO (3D + PARALLAX) */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              style={{
                transform: `translateY(${scrollY * 0.05}px)`
              }}
              className="
                h-12 object-contain
                transition-transform duration-300
                drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]
                hover:-translate-y-1 hover:scale-105
              "
            />
          </Link>

          {/* RIGHT — MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">

            {/* HOME + CAMPFIRE (FLICKER GLOW) */}
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

              <div className="campfire-glow cursor-pointer">
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

            {/* HOST */}
            <div className="relative">
              <button
                onClick={() => setHostMenuOpen(!hostMenuOpen)}
                className="
                  flex items-center gap-1 border px-4 py-1.5 rounded-full text-xs
                  bg-white/60 backdrop-blur
                  transition hover:shadow-md
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
                    hover:bg-emerald-700 transition shadow-md
                  "
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="
                    bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs
                    transition shadow-md
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

            {/* PEOPLE IMAGE — 3D GLASS BADGE */}
            <img
              src={cammp1}
              alt="Campers"
              className="
                h-10 w-10 rounded-full object-cover
                ring-2 ring-orange-300
                bg-white/60 backdrop-blur
                transition-all duration-300
                shadow-md hover:shadow-2xl
                hover:-translate-y-1 hover:scale-105
              "
            />
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-white/60"
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      {/* HEADER SPACER */}
      <div className="h-[72px]" />

      {/* MOBILE MENU (UNCHANGED, CLEAN) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[85%] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileOpen(false)}><X size={26} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
