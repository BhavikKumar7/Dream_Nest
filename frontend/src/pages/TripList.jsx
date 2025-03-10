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

  const [loading, setLoading] = useState(true);
  const tripList = useSelector((state) => state.user?.tripList);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/trips`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

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
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              booking = true,
            }) => (
              <ListingCard
                listingId={listingId.id} 
                creator={hostId.id} 
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
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
