import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Home, Compass, User } from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import cammp1 from "../assets/camp1.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname.startsWith("/admin");
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));

    const onScroll = () => setScrolled(window.scrollY > 30);
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
      {/* ================= DESKTOP NAVBAR ================= */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-xl bg-white/70
          border-b border-white/30
          transition-all duration-300
          ${scrolled ? "h-[56px] shadow-md" : "h-[72px]"}
        `}
      >
        <nav className="w-full h-full px-6 flex items-center">

          {/* LEFT — LOGO */}
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
                    : "hover:text-emerald-600"
                }
              >
                Home
              </NavLink>

              {/* Campfire glow */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-orange-400 blur-lg opacity-0 group-hover:opacity-80 transition" />
                <CampfireAnimated size={26} />
              </div>
            </div>

            <NavLink to="/trips" className="hover:text-emerald-600">
              Trips
            </NavLink>

            <button className="border px-4 py-1.5 rounded-full text-xs hover:bg-white">
              Become a Host
            </button>

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
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs">
                Logout
              </button>
            )}

            {/* People image */}
            <img
              src={cammp1}
              alt="Campers"
              className="h-10 w-10 rounded-full ring-2 ring-orange-300 shadow-md hover:scale-110 transition"
            />
          </div>
        </nav>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur border-t flex justify-around py-2">

        <Link to="/" className="flex flex-col items-center text-xs">
          <Home size={20} />
          Home
        </Link>

        <Link to="/trips" className="flex flex-col items-center text-xs">
          <Compass size={20} />
          Trips
        </Link>

        <Link to="/login" className="flex flex-col items-center text-xs">
          <User size={20} />
          Account
        </Link>
      </div>

      {/* Spacer */}
      <div className="h-[72px] md:h-[72px]" />
      <div className="h-[56px] md:hidden" />
    </>
  );
}
