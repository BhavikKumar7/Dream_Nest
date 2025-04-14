import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer"
import { useNavigate, useParams } from "react-router-dom";

const PropertyList = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user)
  const propertyList = user?.propertyList;
  console.log(user)

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const dispatch = useDispatch()
  const getPropertyList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/properties`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
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
      // Refresh property list
      getPropertyList();
    } catch (err) {
      console.error("Error deleting listing:", err.message);
    }
  };


  useEffect(() => {
    getPropertyList()
  }, [getPropertyList])

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {
          propertyList?.map(
            ({
              id,
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
                listingId={id}
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
                onEdit={() => navigate(`/edit/${id}`)}
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
