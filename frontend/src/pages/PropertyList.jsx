import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const getPropertyList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user._id}/properties`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
      console.log("Property list fetched successfully");
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/properties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete listing");
      
      getPropertyList();
    } catch (err) {
      console.error("Error deleting listing:", err.message);
    }
  };
  useEffect(() => {
    getPropertyList();
  }, [user]);

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {
          propertyList?.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false,
            }) => (
              <ListingCard
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
                onDelete={handleDeleteProperty}
                onEdit={() => navigate(`/edit/${_id}`)}
                hideBooking={true}
              />
            )
          )
        }
      </div>
      <Footer />
    </>
  );
};

export default PropertyList;
