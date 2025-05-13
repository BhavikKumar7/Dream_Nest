import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/List.scss";
import "../styles/Bookings.scss";

const HostListing = () => {
  const { hostId } = useParams();
  const [listings, setListings] = useState([]);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);

  const fetchHostListings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/admin/hosts/${hostId}/listings`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      
      if (data.listings) {
        setListings(data.listings);
      } else {
        setListings([]);
      }
      
      setHost(data.host || null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching host listings:", err.message);
    }
  };

  useEffect(() => {
    fetchHostListings();
  }, [hostId]);

  return (
    <>
      <Navbar />
      <h1 className="title-list title-bookings">Host - Listings</h1>
      
      {error && <p className="error-message">{error}</p>}

      {host && (
        <div className="host-details user-details">
          <h2>{host.firstName} {host.lastName}</h2>
          <p>Email: {host.email}</p>
          <p>Role: {host.role}</p>
        </div>
      )}

      <div className="list bookings-list">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing._id} className="listing-card booking-card">
              <h3>{listing.title}</h3>
              <p><strong>Location:</strong> {`${listing.city}, ${listing.province}, ${listing.country}`}</p>
              <p><strong>Price:</strong> {listing.price} per night</p>
              <p><strong>Description:</strong> {listing.description}</p>
            </div>
          ))
        ) : (
          <p>No listings found for this host.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HostListing;
