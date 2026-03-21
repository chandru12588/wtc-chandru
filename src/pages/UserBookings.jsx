import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api";
import { loadFavorites } from "../utils/wishlist";

const FILTERS = ["ALL", "UPCOMING", "COMPLETED", "CANCELLED", "BOOKING REQUESTS"];

export default function UserBookings() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("wtc_user"));
  const userId = user?._id || user?.id;

  const [activeTab, setActiveTab] = useState("bookings");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (userId) {
      loadBookings();
      loadUserFavorites();
    }
  }, [userId]);

  const loadUserFavorites = async () => {
    try {
      const list = await loadFavorites();
      setFavorites(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("FAVORITES LOAD ERROR:", err);
      setFavorites([]);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);

      const [pkgRes, hostRes, pillionRes] = await Promise.allSettled([
        axios.get(`${API}/api/bookings/user/${userId}`),
        axios.get(`${API}/api/host/bookings/user/${userId}`),
        axios.get(`${API}/api/pillion-requests/user/${userId}`),
      ]);

      const packages = (pkgRes.status === "fulfilled" ? pkgRes.value.data : []).map((item) => ({
        ...item,
        source: "package",
        finalStatus: item.status,
      }));

      const hosts = (hostRes.status === "fulfilled" ? hostRes.value.data : []).map((item) => ({
        ...item,
        source: "host",
        finalStatus: item.bookingStatus,
      }));

      const pillionRequests = (
        pillionRes.status === "fulfilled" ? pillionRes.value.data : []
      ).map((item) => ({
        ...item,
        source: "pillion",
        finalStatus: item.status,
        checkIn: item.startDate,
        checkOut: item.startDate,
        people: 1,
        amount: 0,
      }));

      const merged = [...packages, ...hosts, ...pillionRequests].sort(
        (a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn)
      );

      setBookings(merged);
    } catch (err) {
      console.error("LOAD BOOKINGS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const canCancel = (booking) => {
    if (booking.source === "pillion") return false;
    if (!["pending", "accepted"].includes(booking.finalStatus)) return false;
    return new Date() < new Date(booking.checkIn);
  };

  const cancelBooking = async (booking) => {
    if (!confirm("Cancel this booking?")) return;

    try {
      const url =
        booking.source === "host"
          ? `${API}/api/host/bookings/${booking._id}/cancel`
          : `${API}/api/bookings/${booking._id}/cancel`;
      await axios.put(url);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "Cancel failed");
    }
  };

  const deleteBooking = async (booking) => {
    if (!confirm("Delete this booking/request from your list?")) return;

    try {
      const url =
        booking.source === "host"
          ? `${API}/api/host/bookings/${booking._id}/user-delete?userId=${userId}`
          : booking.source === "pillion"
          ? `${API}/api/pillion-requests/${booking._id}/user-delete?userId=${userId}`
          : `${API}/api/bookings/${booking._id}/user-delete?userId=${userId}`;

      await axios.delete(url);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "Delete failed");
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;

    try {
      setDeletingAccount(true);
      await api.delete("/api/auth/account");
      localStorage.removeItem("wtc_user");
      localStorage.removeItem("wtc_token");
      localStorage.removeItem("wishlist");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };

  const filteredBookings = useMemo(() => {
    const today = new Date();

    return bookings.filter((booking) => {
      const status = String(booking.finalStatus || "").toLowerCase();
      const endDate = booking.checkOut ? new Date(booking.checkOut) : null;

      if (activeFilter === "ALL") return true;
      if (activeFilter === "CANCELLED") return status === "cancelled" || status === "rejected";
      if (activeFilter === "BOOKING REQUESTS") return status === "pending";
      if (activeFilter === "UPCOMING") return status === "accepted" && endDate && endDate >= today;
      if (activeFilter === "COMPLETED") return status === "accepted" && endDate && endDate < today;
      return true;
    });
  }, [bookings, activeFilter]);

  const goToFavorite = (fav) => {
    if (fav.itemType === "listing" || fav.serviceType === "host") navigate(`/host-listing/${fav.itemId}`);
    else navigate(`/packages/${fav.itemId}`);
  };

  if (!user) {
    return <div className="py-20 text-center text-gray-600">Please login to view your dashboard.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-24">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              {String(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-bold">{user?.name || "Explorer"}</p>
              <p className="text-sm text-gray-600">{user?.phone || "No mobile number"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border py-3">
              <p className="text-lg font-bold text-orange-600">{bookings.length}</p>
              <p className="text-xs text-gray-600">Bookings</p>
            </div>
            <div className="rounded-xl border py-3">
              <p className="text-lg font-bold text-orange-600">{favorites.length}</p>
              <p className="text-xs text-gray-600">Favorites</p>
            </div>
          </div>

          <button
            onClick={deleteAccount}
            disabled={deletingAccount}
            className="mt-6 w-full rounded-xl border border-red-300 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {deletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </aside>

        <section className="rounded-3xl bg-white p-5 shadow">
          <div className="flex flex-wrap items-center gap-5 border-b pb-4">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-2 text-2xl font-semibold ${
                activeTab === "bookings" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-700"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-2 text-2xl font-semibold ${
                activeTab === "favorites" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-700"
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-2 text-2xl font-semibold ${
                activeTab === "settings" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-700"
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === "bookings" && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      activeFilter === filter
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="py-10 text-center text-gray-500">Loading your bookings...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-10 text-center text-gray-500">No bookings in this filter.</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {filteredBookings.map((booking) => (
                    <div key={booking._id} className="rounded-2xl border p-4">
                      <div className="grid items-center gap-3 md:grid-cols-[1.7fr_1fr_0.9fr_auto]">
                        <div>
                          <p className="text-xl font-semibold">
                            {booking.packageId?.title || booking.listingId?.title || "Request"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.source === "pillion"
                              ? `${booking.startPoint} -> ${booking.destination}`
                              : booking.packageId?.location || booking.listingId?.location || "Location"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.source === "pillion"
                              ? `${new Date(booking.startDate).toLocaleDateString()} • ${booking.numberOfDays} day(s)`
                              : `${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(
                                  booking.checkOut
                                ).toLocaleDateString()}`}
                          </p>
                        </div>

                        <div className="font-semibold">
                          {booking.source === "pillion" ? booking.bikeBrand : `Rs. ${booking.amount || 0}`}
                        </div>

                        <div
                          className={`text-sm font-bold uppercase ${
                            booking.finalStatus === "accepted"
                              ? "text-green-600"
                              : booking.finalStatus === "cancelled" || booking.finalStatus === "rejected"
                              ? "text-gray-600"
                              : "text-amber-600"
                          }`}
                        >
                          {booking.finalStatus}
                        </div>

                        <div className="flex gap-2">
                          {canCancel(booking) && (
                            <button
                              onClick={() => cancelBooking(booking)}
                              className="rounded-lg border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-600"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(booking)}
                            className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "favorites" && (
            <div className="mt-4">
              {favorites.length === 0 ? (
                <p className="py-10 text-center text-gray-500">No favorites yet. Tap heart on any trip.</p>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <button
                      key={`${fav.itemType}-${fav.itemId}`}
                      onClick={() => goToFavorite(fav)}
                      className="grid w-full grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border p-3 text-left hover:bg-gray-50"
                    >
                      <img
                        src={fav.image || "/no-image.jpg"}
                        alt={fav.title || "Favorite"}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold">{fav.title || "Saved Trip"}</p>
                        <p className="text-sm text-gray-600">{fav.location || "-"}</p>
                      </div>
                      <div className="font-semibold text-orange-600">Rs. {fav.price || 0}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mt-6 max-w-md space-y-3 rounded-2xl border p-4">
              <p className="text-lg font-semibold">Account Settings</p>
              <p className="text-sm text-gray-600">You can permanently delete your account and all booking data.</p>
              <button
                onClick={deleteAccount}
                disabled={deletingAccount}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingAccount ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
