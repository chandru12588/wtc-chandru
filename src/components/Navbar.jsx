import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Compass, User } from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import cammp1 from "../assets/camp1.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));

    const onScroll = () => setScrolled(window.scrollY > 20);
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
        className={`fixed top-0 left-0 right-0 z-50
          bg-white/80 backdrop-blur-md border-b
          transition-all duration-300
          ${scrolled ? "h-[56px]" : "h-[64px]"}
        `}
      >
        <nav className="w-full h-full flex items-center px-4 md:px-8">

          {/* LOGO — HARD LEFT */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className={`object-contain transition-transform duration-300
                ${scrolled ? "h-9" : "h-11"}
                hover:scale-105 drop-shadow-lg
              `}
            />
          </Link>

          {/* DESKTOP MENU — HARD RIGHT */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">

            <NavLink to="/" className="hover:text-emerald-600">Home</NavLink>

            <div className="relative group">
              <CampfireAnimated size={24} />
              <div className="absolute inset-0 blur-lg bg-orange-400 opacity-0 group-hover:opacity-40 transition" />
            </div>

            <NavLink to="/trips" className="hover:text-emerald-600">Trips</NavLink>

            <Link
              to="/host/register"
              className="border px-4 py-1.5 rounded-full text-xs hover:bg-gray-50"
            >
              Become a Host
            </Link>

            {!user ? (
              <>
                <Link className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs" to="/login">
                  Login
                </Link>
                <Link className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs" to="/admin/login">
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

            <img
              src={cammp1}
              alt="Campers"
              className="h-10 w-10 rounded-full ring-2 ring-orange-300 shadow-md"
            />
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="ml-auto md:hidden"
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      {/* FIX GAP UNDER FIXED NAVBAR */}
      <div className="h-[64px]" />

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white">
            <div className="flex justify-between p-4 border-b">
              <span className="font-bold">Menu</span>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            <div className="flex flex-col gap-4 p-6">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>🏠 Home</NavLink>
              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>🧭 Trips</NavLink>
              <NavLink to="/host/register" onClick={() => setMobileOpen(false)}>🏕 Become a Host</NavLink>

              {!user ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/admin/login">Admin</Link>
                </>
              ) : (
                <button onClick={handleLogout}>Logout</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex md:hidden justify-around py-2">
        <Link to="/" className="flex flex-col items-center text-xs"><Home size={18} />Home</Link>
        <Link to="/trips" className="flex flex-col items-center text-xs"><Compass size={18} />Trips</Link>
        <Link to="/login" className="flex flex-col items-center text-xs"><User size={18} />Login</Link>
      </div>
    </>
  );
}
