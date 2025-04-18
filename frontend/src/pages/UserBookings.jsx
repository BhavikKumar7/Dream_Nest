import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Bookings.scss";

const UserBookings = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/admin/users/${userId}/bookings`);
        const data = await response.json();
        console.log("Fetched data:", data);
        setBookings(data.bookings || []);
        setUser(data.user || null);
      } catch (err) {
        console.error("Error fetching user bookings:", err.message);
      }
    };
  
    fetchUserBookings();
  }, [userId]);
  

  return (
    <>
      <Navbar />
      <h1 className="title-bookings">Admin - Bookings of User</h1>
      {user && (
        <div className="user-details">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map((bookings) => (
            <div key={bookings.id} className="booking-card">
              <p><strong>Property:</strong> {bookings.propertyTitle}</p>
              <p><strong>Check-in:</strong> {bookings.checkIn}</p>
              <p><strong>Check-out:</strong> {bookings.checkOut}</p>
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
