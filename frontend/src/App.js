import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import EditListing from "./pages/EditListing";
import HostDashboard from "./pages/HostDashboard";
import UserDashboard from "./pages/UserDashboard";
import ReservationList from "./pages/ReservationList";
import AdminDashboard from "./pages/adminDashboard";
import UserList from "./pages/UserList";
import HostList from "./pages/HostList";
import UserBookings from "./pages/UserBookings";
import HostListings from "./pages/HostListings";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishList" element={<WishList />} />
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
          <Route path="/edit/:id" element={<EditListing />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList/>} />
          <Route path="/admin/hosts" element={<HostList />} />
          <Route path="/admin/users/:userId/bookings" element={<UserBookings />} />
          <Route path="/admin/hosts/:hostId/listings" element={<HostListings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;