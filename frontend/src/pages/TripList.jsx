import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";


const TripList = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);

  const tripList = useSelector((state) => state.user?.tripList);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getTripList();
    }
  }, [user, navigate]);

  const getTripList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}/trips`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  const handleCancelTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to cancel trip");

      getTripList();
    } catch (err) {
      console.error("Error cancelling trip:", err.message);
    }
  };




  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {
          tripList?.map(
            ({
              id,
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              booking = true,
            }) => (
              <ListingCard
                tripId={id}
                listingId={listingId}
                creator={hostId}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
                showCancel={true}
                onCancel={() => handleCancelTrip(id)}
                expandable={true}
                isExpanded={expandedTripId === id}
                onToggleExpand={() => setExpandedTripId(prev => prev === id ? null : id)}
              />

            )
          )
        }
      </div>
      <Footer />
    </>
  );
};

export default TripList;
