import React, { useState, useEffect, useRef } from "react";
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
  UserPlus,
} from "lucide-react";

import logo3 from "../assets/log3.png";
import CampfireAnimated from "../components/CampfireAnimated";
import { getHostUser, logoutHost } from "../utils/hostAuth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hostMenu, setHostMenu] = useState(false);
  const [servicesMenu, setServicesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [hostUser, setHostUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const hostRef = useRef(null);
  const servicesRef = useRef(null);
  const userRef = useRef(null);

  /** Sync user state */
  useEffect(() => {
    const saved = localStorage.getItem("wtc_user");
    setUser(saved ? JSON.parse(saved) : null);
    setHostUser(getHostUser());
    setIsAdminLoggedIn(Boolean(localStorage.getItem("adminToken")));
  }, [location.pathname]);

  /** Scroll shrink effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Close dropdown if clicked outside */
  useEffect(() => {
    const handler = (e) => {
      if (hostRef.current && !hostRef.current.contains(e.target)) {
        setHostMenu(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wtc_user");
    localStorage.removeItem("wtc_token");
    setUser(null);
    navigate("/");
  };

  const handleHostLogout = () => {
    logoutHost();
    setHostUser(null);
    setHostMenu(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

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
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src={logo3} alt="Trippolama" className={`${scrolled ? "h-20" : "h-20"}`} />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="brand-wave-text text-lg md:text-2xl font-extrabold tracking-wide">
                Trippolama
              </span>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.22em] text-emerald-700">
                Explore. Smile. Repeat.
              </span>
            </span>
          </Link>

          {/* ================= Desktop Menu ================= */}
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/">Home</NavLink>

            <CampfireAnimated size={26} />

            <NavLink to="/trips">Trips</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>

            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setServicesMenu((prev) => !prev)}
                className="flex items-center gap-1 rounded-full border px-4 py-2 text-xs hover:bg-gray-50"
              >
                Services <ChevronDown size={14} className={`${servicesMenu && "rotate-180"} duration-200`} />
              </button>

              {servicesMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg bg-white shadow-lg animate-fadeIn">
                  <Link to="/trips?service=bike" onClick={() => setServicesMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Pillion Rider Service
                  </Link>
                  <Link to="/trips?service=guide" onClick={() => setServicesMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Tour Guide Service
                  </Link>
                  <Link to="/trips?service=host" onClick={() => setServicesMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Hosted Stays
                  </Link>
                  <Link to="/trips?service=driver" onClick={() => setServicesMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Acting Driver Service
                  </Link>
                </div>
              )}
            </div>

            {/* Become Host Dropdown */}
            <div ref={hostRef} className="relative flex items-center gap-2">
              <button
                onClick={() => setHostMenu((prev) => !prev)}
                className="border px-4 py-2 rounded-full text-xs flex items-center gap-1 hover:bg-gray-50"
              >
                {hostUser ? "Hosting" : "Become a Host"} <ChevronDown size={14} className={`${hostMenu && "rotate-180"} duration-200`} />
              </button>

              {hostMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg bg-white shadow-lg animate-fadeIn">
                  {hostUser ? (
                    <>
                      <Link to="/host/dashboard" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                        Host Dashboard
                      </Link>
                      <Link to="/host/add-listing" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                        Add Listing
                      </Link>
                      <button onClick={handleHostLogout} className="block w-full px-4 py-3 text-left hover:bg-gray-100">
                        Host Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/host/login" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                        Host Login
                      </Link>
                      <Link to="/host/register" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                        Host Register
                      </Link>
                    </>
                  )}
                  <Link to="/guide/register" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Guide Register
                  </Link>
                  <Link to="/acting-driver/register" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Acting Driver Register
                  </Link>
                  <Link to="/bike-rider/register" onClick={() => setHostMenu(false)} className="block px-4 py-3 hover:bg-gray-100">
                    Bike Rider Register
                  </Link>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!user && (
              <>
                <Link to="/login?mode=signup" className="rounded-full border border-slate-300 px-4 py-1.5 text-xs text-slate-700">
                  Signup
                </Link>
                <Link to="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs">
                  Login
                </Link>
              </>
            )}

            {!user && (
              <Link to="/admin/login" className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs">
                Admin
              </Link>
            )}

            {isAdminLoggedIn && (
              <Link to="/admin" className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs">
                Admin Panel
              </Link>
            )}

            {/* User Profile */}
            {user && (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-slate-50"
                >
                  <span>Hi {user.name || "Explorer"}</span>
                  <span className="penguin-greeter" aria-hidden="true">
                    <span className="penguin-head">
                      <span className="penguin-eye left" />
                      <span className="penguin-eye right" />
                      <span className="penguin-beak" />
                    </span>
                    <span className="penguin-body">
                      <span className="penguin-belly" />
                      <span className="penguin-wing left" />
                      <span className="penguin-wing right" />
                    </span>
                  </span>
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setUserMenu(false);
                        navigate("/my-bookings");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={() => {
                        setUserMenu(false);
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserMenu(false);
                        handleLogout();
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= Mobile Menu Btn ================= */}
          <button
            onClick={() => {
              setMobileOpen(true);
              setMobileServicesOpen(false);
            }}
            className="ml-auto md:hidden"
          >
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {/* ================= Mobile Drawer ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[78%] bg-white">
            <div className="flex justify-between p-4 border-b">
              <span className="font-bold">{user ? `Hi ${user.name}` : "Menu"}</span>
              <X onClick={closeMobileMenu} />
            </div>

            <div className="flex flex-col gap-4 p-6 text-sm">
              <NavLink to="/" onClick={closeMobileMenu}><Home size={18} /> Home</NavLink>
              <NavLink to="/trips" onClick={closeMobileMenu}><Compass size={18} /> Trips</NavLink>
              <NavLink to="/reviews" onClick={closeMobileMenu}><Compass size={18} /> Reviews</NavLink>
              <div className="rounded-lg border">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Compass size={18} /> Services
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      mobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="border-t px-3 py-2">
                    <NavLink
                      to="/trips?service=bike"
                      onClick={closeMobileMenu}
                      className="block rounded px-2 py-2"
                    >
                      Pillion Rider Service
                    </NavLink>
                    <NavLink
                      to="/trips?service=guide"
                      onClick={closeMobileMenu}
                      className="block rounded px-2 py-2"
                    >
                      Tour Guide Service
                    </NavLink>
                    <NavLink
                      to="/trips?service=host"
                      onClick={closeMobileMenu}
                      className="block rounded px-2 py-2"
                    >
                      Hosted Stays
                    </NavLink>
                    <NavLink
                      to="/trips?service=driver"
                      onClick={closeMobileMenu}
                      className="block rounded px-2 py-2"
                    >
                      Acting Driver Service
                    </NavLink>
                  </div>
                )}
              </div>

              {user && (
                <NavLink to="/my-bookings" onClick={closeMobileMenu}>
                  <User size={18} /> My Bookings
                </NavLink>
              )}

              {user && (
                <NavLink to="/profile" onClick={closeMobileMenu}>
                  <User size={18} /> Edit Profile
                </NavLink>
              )}

              <hr />

              <NavLink to="/host/login" onClick={closeMobileMenu}>
                <LogIn size={18} /> Host Login
              </NavLink>

              <NavLink to={hostUser ? "/host/dashboard" : "/host/register"} onClick={closeMobileMenu}>
                <UserPlus size={18} /> {hostUser ? "Host Dashboard" : "Host Register"}
              </NavLink>

              {hostUser && (
                <NavLink to="/host/add-listing" onClick={closeMobileMenu}>
                  <UserPlus size={18} /> Add Listing
                </NavLink>
              )}

              <NavLink to="/guide/register" onClick={closeMobileMenu}>
                <UserPlus size={18} /> Guide Register
              </NavLink>

              <NavLink to="/acting-driver/register" onClick={closeMobileMenu}>
                <UserPlus size={18} /> Acting Driver Register
              </NavLink>

              <NavLink to="/bike-rider/register" onClick={closeMobileMenu}>
                <UserPlus size={18} /> Bike Rider Register
              </NavLink>

              {!user && (
                <NavLink to="/admin/login" onClick={closeMobileMenu}>
                  <ShieldCheck size={18} /> Admin
                </NavLink>
              )}

              {!user ? (
                <>
                  <NavLink to="/login?mode=signup" onClick={closeMobileMenu}>
                    <UserPlus size={18} /> Signup
                  </NavLink>
                  <NavLink to="/login" onClick={closeMobileMenu}>
                    <LogIn size={18} /> User Login
                  </NavLink>
                </>
              ) : (
                <button onClick={handleLogout} className="text-red-600 flex gap-2">
                  <LogOut size={18} /> Logout
                </button>
              )}

              {hostUser && (
                <button onClick={handleHostLogout} className="text-red-600 flex gap-2">
                  <LogOut size={18} /> Host Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}



