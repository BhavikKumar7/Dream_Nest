import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Bookings.scss";

const UserBookings = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/admin/users/${userId}/bookings`);
        if (!response.ok) throw new Error("Failed to fetch user bookings");

        const data = await response.json();
        setUser(data.user || null);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching user bookings:", err.message);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <>
      <Navbar />
      <h1 className="title-bookings">Admin - Bookings of User</h1>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error-message">{error}</p>}

      {user && (
        <div className="user-details">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}

      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p><strong>Property:</strong> {booking.listingId?.title || "Untitled"}</p>
              <p><strong>Category:</strong> {booking.listingId?.category || "N/A"}</p>
              <p><strong>Check-in:</strong> {formatDate(booking.startDate)}</p>
              <p><strong>Check-out:</strong> {formatDate(booking.endDate)}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
            </div>
          ))
        ) : (
          <p>No bookings found for this user.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default UserBookings;
