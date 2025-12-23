import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Compass,
  User,
  LogIn,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import cammp1 from "../assets/camp1.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  /* 🔑 SYNC USER INSTANTLY (OTP FIX) */
  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    setUser(saved ? JSON.parse(saved) : null);
    setAvatarOpen(false); // close dropdown on route change
  }, [location.pathname]);

  /* SCROLL SHRINK */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wtc_user");
    setUser(null);
    navigate("/");
  };

  if (isAdminPage) return null;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50
        bg-white/90 backdrop-blur-xl border-b
        transition-all duration-300
        ${scrolled ? "h-[56px] shadow-md" : "h-[72px]"}`}
      >
        <nav className="w-full h-full flex items-center px-4 md:px-8">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className={`${scrolled ? "h-10" : "h-12"}`}
            />
          </Link>

          {/* ================= DESKTOP ================= */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/">Home</NavLink>

            <CampfireAnimated size={26} />

            <NavLink to="/trips">Trips</NavLink>

            {/* ⭐ CLEAR MY BOOKINGS */}
            {user && (
              <NavLink
                to="/my-bookings"
                className="text-emerald-700 font-semibold"
              >
                My Bookings
              </NavLink>
            )}

            {/* HOST */}
            <div className="relative group">
              <button className="border px-4 py-1.5 rounded-full text-xs flex items-center gap-1">
                Become a Host <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow rounded-lg">
                <Link to="/host/login" className="block px-4 py-3 hover:bg-gray-100">
                  Host Login
                </Link>
                <Link to="/host/register" className="block px-4 py-3 hover:bg-gray-100">
                  Host Register
                </Link>
              </div>
            </div>

            {/* AUTH BUTTONS */}
            {!user && (
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
            )}

            {/* 👋 GREETING + AVATAR */}
            {user && (
              <div className="relative flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Hi {user.name || "Explorer"} 👋
                </span>

                <img
                  src={cammp1}
                  alt="User"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className={`cursor-pointer rounded-full ring-2 ring-orange-400
                  ${scrolled ? "h-9 w-9" : "h-11 w-11"}`}
                />

                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-xl overflow-hidden">
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button onClick={() => setMobileOpen(true)} className="ml-auto md:hidden">
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white">
            <div className="flex justify-between p-4 border-b">
              <span className="font-bold">
                {user ? `Hi ${user.name || "Explorer"} 👋` : "Menu"}
              </span>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            <div className="flex flex-col gap-4 p-6 text-sm">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>
                <Home size={18} /> Home
              </NavLink>

              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>
                <Compass size={18} /> Trips
              </NavLink>

              {user && (
                <NavLink to="/my-bookings">
                  <User size={18} /> My Bookings
                </NavLink>
              )}

              <hr />

              {!user ? (
                <>
                  <NavLink to="/login">
                    <LogIn size={18} /> Login
                  </NavLink>
                  <NavLink to="/admin/login">
                    <ShieldCheck size={18} /> Admin
                  </NavLink>
                </>
              ) : (
                <button onClick={handleLogout} className="text-red-600 flex gap-2">
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
