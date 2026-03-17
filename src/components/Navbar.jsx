import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import { getHostUser, logoutHost } from "../utils/hostAuth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");

  const OWNER_EMAIL = "chandru.balasub12588@gmail.com";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [hostMenu, setHostMenu] = useState(false);
  const [servicesMenu, setServicesMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [hostUser, setHostUser] = useState(null);

  const hostRef = useRef(null);
  const servicesRef = useRef(null);

  // Sync user
  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    setUser(saved ? JSON.parse(saved) : null);
    setHostUser(getHostUser());
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scroll when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  // Close dropdown outside click
  useEffect(() => {
    const handler = (e) => {
      if (hostRef.current && !hostRef.current.contains(e.target)) {
        setHostMenu(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesMenu(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wtc_user");
    setUser(null);
    navigate("/");
  };

  const handleHostLogout = () => {
    logoutHost();
    setHostUser(null);
    setHostMenu(false);
    navigate("/");
  };

  const isOwnerUser =
    !!user?.email &&
    user.email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  if (isAdminPage) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled ? "h-[56px] shadow-md" : "h-[72px]"
        }`}
      >
        <nav className="w-full h-full flex items-center px-4 md:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo3}
              alt="Trippolama"
              className={`${scrolled ? "h-18" : "h-18"} transition-all`}
            />
            <span className="font-bold text-lg hidden md:block">
              Trippolama
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            
            <NavLink to="/">Home</NavLink>

            <CampfireAnimated size={24} />

            <NavLink to="/trips">Trips</NavLink>

            {user && (
              <NavLink to="/my-bookings" className="text-emerald-600 font-semibold">
                My Bookings
              </NavLink>
            )}

            {/* Services Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setServicesMenu(!servicesMenu)}
                className="flex items-center gap-1 border px-4 py-2 rounded-full text-xs hover:bg-gray-50"
              >
                Services
                <ChevronDown size={14} className={`${servicesMenu && "rotate-180"} transition`} />
              </button>

              {servicesMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg">
                  <Link to="/trips?service=bike" className="block px-4 py-3 hover:bg-gray-100">Pillion Rider</Link>
                  <Link to="/trips?service=guide" className="block px-4 py-3 hover:bg-gray-100">Tour Guide</Link>
                  <Link to="/trips?service=host" className="block px-4 py-3 hover:bg-gray-100">Hosted Stays</Link>
                  <Link to="/trips?service=driver" className="block px-4 py-3 hover:bg-gray-100">Driver</Link>
                </div>
              )}
            </div>

            {/* Host Dropdown */}
            <div ref={hostRef} className="relative">
              <button
                onClick={() => setHostMenu(!hostMenu)}
                className="border px-4 py-2 rounded-full text-xs flex items-center gap-1 hover:bg-gray-50"
              >
                {hostUser ? "Hosting" : "Become Host"}
                <ChevronDown size={14} className={`${hostMenu && "rotate-180"} transition`} />
              </button>

              {hostMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg">
                  {hostUser ? (
                    <>
                      <Link to="/host/dashboard" className="block px-4 py-3 hover:bg-gray-100">Dashboard</Link>
                      <Link to="/host/add-listing" className="block px-4 py-3 hover:bg-gray-100">Add Listing</Link>
                      <button onClick={handleHostLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/host/login" className="block px-4 py-3 hover:bg-gray-100">Login</Link>
                      <Link to="/host/register" className="block px-4 py-3 hover:bg-gray-100">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            {!user ? (
              <>
                <Link to="/login?mode=signup" className="border px-4 py-1.5 rounded-full text-xs">
                  Signup
                </Link>
                <Link to="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs">
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span>Hi {user.name || "Explorer"} 👋</span>
                <button onClick={handleLogout} className="text-red-500 flex items-center gap-1">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}

            {isOwnerUser && (
              <Link to="/admin/login" className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileOpen(true)} className="ml-auto md:hidden">
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-[999] md:hidden">
          <div className="absolute right-0 w-[80%] h-full bg-white">
            <div className="flex justify-between p-4 border-b">
              <span>{user ? `Hi ${user.name}` : "Menu"}</span>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            <div className="p-6 flex flex-col gap-4">
              <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/trips" onClick={() => setMobileOpen(false)}>Trips</NavLink>

              {!user ? (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/login?mode=signup">Signup</NavLink>
                </>
              ) : (
                <button onClick={handleLogout} className="text-red-500">
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