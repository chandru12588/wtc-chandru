import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Home.jsx"));
const PackagesList = lazy(() => import("./pages/PackagesList.jsx"));
const PackageDetails = lazy(() => import("./pages/PackageDetails.jsx"));
const BookingPage = lazy(() => import("./pages/BookingPage.jsx"));
const Trips = lazy(() => import("./pages/Trips.jsx"));
const TripDetails = lazy(() => import("./pages/TripDetails.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const Safety = lazy(() => import("./pages/Safety.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const Reviews = lazy(() => import("./pages/Reviews.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const UserBookings = lazy(() => import("./pages/UserBookings.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const BikeRiderRegister = lazy(() => import("./pages/BikeRiderRegister.jsx"));
const GuideRegister = lazy(() => import("./pages/GuideRegister.jsx"));
const ActingDriverRegister = lazy(() => import("./pages/ActingDriverRegister.jsx"));
const PillionRideRequestPage = lazy(() => import("./pages/PillionRideRequestPage.jsx"));
const KodaikanalAgents = lazy(() => import("./pages/KodaikanalAgents.jsx"));
const RoadsideAssistance = lazy(() => import("./pages/RoadsideAssistance.jsx"));
const KodaikanalPlacePage = lazy(() => import("./pages/KodaikanalPlacePage.jsx"));
const HostListingDetails = lazy(() => import("./pages/HostListingDetails.jsx"));

const AdminLogin = lazy(() => import("./admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard.jsx"));
const AdminPackages = lazy(() => import("./admin/AdminPackages.jsx"));
const PackageForm = lazy(() => import("./admin/PackageForm.jsx"));
const AdminBookings = lazy(() => import("./admin/AdminBookings.jsx"));
const AdminHostListings = lazy(() => import("./admin/AdminHostListings.jsx"));
const AdminHostBookings = lazy(() => import("./admin/AdminHostBookings.jsx"));
const AdminUsers = lazy(() => import("./admin/AdminUsers.jsx"));
const AdminProfile = lazy(() => import("./admin/AdminProfile.jsx"));
const AdminBikeRiders = lazy(() => import("./admin/AdminBikeRiders.jsx"));
const AdminGuides = lazy(() => import("./admin/AdminGuides.jsx"));
const AdminPillionRequests = lazy(() => import("./admin/AdminPillionRequests.jsx"));
const AdminStories = lazy(() => import("./admin/AdminStories.jsx"));
const AdminActingDrivers = lazy(() => import("./admin/AdminActingDrivers.jsx"));
const AdminTravelAgentRequests = lazy(() => import("./admin/AdminTravelAgentRequests.jsx"));
const AdminRoadsideAssistance = lazy(() => import("./admin/AdminRoadsideAssistance.jsx"));

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

const HostRegister = lazy(() => import("./host/HostRegister.jsx"));
const HostLogin = lazy(() => import("./host/HostLogin.jsx"));
const HostDashboard = lazy(() => import("./host/HostDashboard.jsx"));
const AddListing = lazy(() => import("./host/AddListing.jsx"));
const EditListing = lazy(() => import("./host/EditListing.jsx"));
import HostRoute from "./host/HostRoute.jsx";

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-600">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<PackagesList />} />
        <Route path="/kodaikanal" element={<PackagesList />} />
        <Route path="/kodaikanal/:placeSlug" element={<KodaikanalPlacePage />} />
        <Route path="/ooty" element={<PackagesList />} />
        <Route path="/munnar" element={<PackagesList />} />
        <Route path="/valapari" element={<PackagesList />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/guide/:id" element={<PackageDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/my-bookings" element={<UserBookings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/bike-rider/register" element={<BikeRiderRegister />} />
        <Route path="/guide/register" element={<GuideRegister />} />
        <Route path="/acting-driver/register" element={<ActingDriverRegister />} />
        <Route path="/pillion-request/:id" element={<PillionRideRequestPage />} />
        <Route path="/travel-agents" element={<KodaikanalAgents />} />
        <Route path="/kodaikanal-agents" element={<KodaikanalAgents />} />
        <Route path="/roadside-assistance" element={<RoadsideAssistance />} />
        <Route path="/host-listing/:id" element={<HostListingDetails />} />

        <Route path="/host/register" element={<HostRegister />} />
        <Route path="/host/login" element={<HostLogin />} />
        <Route path="/host/dashboard" element={<HostRoute><HostDashboard /></HostRoute>} />
        <Route path="/host/add-listing" element={<HostRoute><AddListing /></HostRoute>} />
        <Route path="/host/edit/:id" element={<HostRoute><EditListing /></HostRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="packages/new" element={<PackageForm />} />
          <Route path="packages/:id/edit" element={<PackageForm />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="host-listings" element={<AdminHostListings />} />
          <Route path="host-bookings" element={<AdminHostBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bike-riders" element={<AdminBikeRiders />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="acting-drivers" element={<AdminActingDrivers />} />
          <Route path="pillion-requests" element={<AdminPillionRequests />} />
          <Route path="travel-agent-requests" element={<AdminTravelAgentRequests />} />
          <Route path="roadside-assistance" element={<AdminRoadsideAssistance />} />
          <Route path="stories" element={<AdminStories />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
