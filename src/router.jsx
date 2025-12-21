// frontend/src/router.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home.jsx";
import PackagesList from "./pages/PackagesList.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import Trips from "./pages/Trips.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import Login from "./pages/Login.jsx";
import FAQ from "./pages/FAQ.jsx";
import Safety from "./pages/Safety.jsx";
import Blog from "./pages/Blog.jsx";
import UserBookings from "./pages/UserBookings.jsx";
import SearchResults from "./pages/SearchResults.jsx";

// ⭐ Host Listing Details (Public)
import HostListingDetails from "./pages/HostListingDetails.jsx";

// Admin pages
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminPackages from "./admin/AdminPackages.jsx";
import PackageForm from "./admin/PackageForm.jsx";
import AdminBookings from "./admin/AdminBookings.jsx";
import AdminHostListings from "./admin/AdminHostListings.jsx";
import AdminHostBookings from "./admin/AdminHostBookings.jsx"; // ⭐ NEW

// Layout + protection
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// ⭐ HOST MODULE
import HostRegister from "./host/HostRegister.jsx";
import HostLogin from "./host/HostLogin.jsx";
import HostDashboard from "./host/HostDashboard.jsx";
import AddListing from "./host/AddListing.jsx";
import HostRoute from "./host/HostRoute.jsx";

export default function AppRouter() {
  return (
    <Routes>

      {/* ============================
           PUBLIC ROUTES
      ============================= */}
      <Route path="/" element={<Home />} />
      <Route path="/packages" element={<PackagesList />} />
      <Route path="/packages/:id" element={<PackageDetails />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/:id" element={<TripDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<SearchResults />} />

      {/* ⭐ PUBLIC HOST LISTING PAGE */}
      <Route path="/host-listing/:id" element={<HostListingDetails />} />

      {/* USER BOOKINGS */}
      <Route path="/my-bookings" element={<UserBookings />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/blog" element={<Blog />} />

      {/* ============================
           HOST MODULE ROUTES
      ============================= */}
      <Route path="/host/register" element={<HostRegister />} />
      <Route path="/host/login" element={<HostLogin />} />

      <Route
        path="/host/dashboard"
        element={
          <HostRoute>
            <HostDashboard />
          </HostRoute>
        }
      />

      <Route
        path="/host/add-listing"
        element={
          <HostRoute>
            <AddListing />
          </HostRoute>
        }
      />

      {/* ============================
           ADMIN ROUTES
      ============================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<PackageForm />} />
        <Route path="packages/:id/edit" element={<PackageForm />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="host-listings" element={<AdminHostListings />} />

        {/* ⭐ ADMIN HOST BOOKINGS PAGE (NEW) */}
        <Route path="host-bookings" element={<AdminHostBookings />} />
      </Route>

      {/* ============================
           FALLBACK
      ============================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
