import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

import { useNavigate } from "react-router-dom";

const ReservationList = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const reservationList = useSelector((state) => state.user?.reservationList);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/reservations`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {
          reservationList?.map(
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

export default ReservationList;
