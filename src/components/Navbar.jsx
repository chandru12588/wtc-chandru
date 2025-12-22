import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Compass,
  LogIn,
  ShieldCheck,
  Tent,
  UserPlus,
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
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <nav className="h-[72px] w-full flex items-center justify-between px-6">

          {/* 🔹 LEFT — LOGO (NO GAP) */}
          <Link to="/" className="flex items-center">
            <img
              src={logo3}
              alt="WrongTurn Club"
              className="h-18 object-contain block"
            />
          </Link>

          {/* 🔹 RIGHT — MENU + PEOPLE */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">

            <NavLink to="/" className="hover:text-emerald-600">
              Home
            </NavLink>

            {/* Campfire (slightly bigger) */}
            <CampfireAnimated size={34} />

            <NavLink to="/trips" className="hover:text-emerald-600">
              Trips
            </NavLink>

            {/* Become Host */}
            <div className="relative group">
              <button className="border px-4 py-1.5 rounded-full text-xs flex items-center gap-1">
                Become a Host <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg overflow-hidden">
                <Link to="/host/login" className="block px-4 py-3 hover:bg-gray-100">
                  Host Login
                </Link>
                <Link to="/host/register" className="block px-4 py-3 hover:bg-gray-100">
                  Host Register
                </Link>
              </div>
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

            {/* People Image (18x18 EXACT) */}
            <img
              src={cammp1}
              alt="Campers"
              className="h-18 w-18 rounded-full ring-2 ring-orange-300 shadow-md block"
            />
          </div>

          {/* 🔹 MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2"
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      {/* Spacer (matches navbar height exactly) */}
      <div className="h-[72px]" />

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white">
            <div className="flex justify-between items-center p-4 border-b">
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

              <button
                onClick={() => setMobileHostOpen(!mobileHostOpen)}
                className="flex items-center justify-between"
              >
                <span className="flex gap-2">
                  <Tent size={18} /> Become a Host
                </span>
                <ChevronDown size={16} />
              </button>

              {mobileHostOpen && (
                <div className="ml-6 flex flex-col gap-3">
                  <NavLink to="/host/login" onClick={() => setMobileOpen(false)} className="flex gap-2">
                    <LogIn size={16} /> Host Login
                  </NavLink>
                  <NavLink to="/host/register" onClick={() => setMobileOpen(false)} className="flex gap-2">
                    <UserPlus size={16} /> Host Register
                  </NavLink>
                </div>
              )}

              <hr />

              {!user ? (
                <>
                  <NavLink to="/login" onClick={() => setMobileOpen(false)} className="flex gap-2">
                    <LogIn size={18} /> User Login
                  </NavLink>
                  <NavLink to="/admin/login" onClick={() => setMobileOpen(false)} className="flex gap-2">
                    <ShieldCheck size={18} /> Admin Login
                  </NavLink>
                </>
              ) : (
                <button onClick={handleLogout} className="text-red-600">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
