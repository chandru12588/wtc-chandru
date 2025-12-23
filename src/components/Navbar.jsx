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
  Tent,
  UserPlus,
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
  const [mobileHostOpen, setMobileHostOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    if (saved) setUser(JSON.parse(saved));

    const onScroll = () => setScrolled(window.scrollY > 40);
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
        bg-white/70 backdrop-blur-xl
        border-b border-white/40
        transition-all duration-300
        ${scrolled ? "h-[56px] shadow-md" : "h-[72px]"}`}
      >
        <nav className="w-full h-full flex items-center px-4 md:px-8">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className={`transition-all duration-300
              ${scrolled ? "h-[40px]" : "h-[48px]"}`}
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/" className="hover:text-emerald-600">
              Home
            </NavLink>

            <CampfireAnimated size={28} />

            <NavLink to="/trips" className="hover:text-emerald-600">
              Trips
            </NavLink>

            {/* ⭐ NEW — MY BOOKINGS (VISIBLE) */}
            {user && (
              <NavLink
                to="/my-bookings"
                className="font-semibold text-emerald-700 hover:underline"
              >
                My Bookings
              </NavLink>
            )}

            {/* HOST MENU */}
            <div className="relative group">
              <button className="border px-4 py-1.5 rounded-full text-xs flex items-center gap-1">
                Become a Host <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg">
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
                <Link to="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs">
                  Login
                </Link>
                <Link to="/admin/login" className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs">
                  Admin
                </Link>
              </>
            )}

            {/* AVATAR */}
            {user && (
              <div className="relative">
                <img
                  src={cammp1}
                  alt="User"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className={`rounded-full ring-2 ring-orange-300 cursor-pointer
                  ${scrolled ? "h-9 w-9" : "h-11 w-11"}`}
                />

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl">
                    <Link to="/my-bookings" className="block px-4 py-3 hover:bg-gray-100">
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

          {/* MOBILE MENU BUTTON */}
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
              <span className="font-bold">Menu</span>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            <div className="flex flex-col gap-4 p-6 text-sm">
              <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex gap-2">
                <Home size={18} /> Home
              </NavLink>

              <NavLink to="/trips" onClick={() => setMobileOpen(false)} className="flex gap-2">
                <Compass size={18} /> Trips
              </NavLink>

              {/* ⭐ MY BOOKINGS — MOBILE */}
              {user && (
                <NavLink to="/my-bookings" className="flex gap-2">
                  <User size={18} /> My Bookings
                </NavLink>
              )}

              <hr />

              {!user && (
                <>
                  <NavLink to="/login" className="flex gap-2">
                    <LogIn size={18} /> Login
                  </NavLink>

                  <NavLink to="/admin/login" className="flex gap-2">
                    <ShieldCheck size={18} /> Admin
                  </NavLink>
                </>
              )}

              {user && (
                <button onClick={handleLogout} className="flex gap-2 text-red-600">
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t flex justify-around py-2 z-40">
        <NavLink to="/" className="flex flex-col items-center text-xs">
          <Home size={18} /> Home
        </NavLink>
        <NavLink to="/trips" className="flex flex-col items-center text-xs">
          <Compass size={18} /> Trips
        </NavLink>
        <NavLink to="/my-bookings" className="flex flex-col items-center text-xs">
          <User size={18} /> Bookings
        </NavLink>
      </div>
    </>
  );
}
