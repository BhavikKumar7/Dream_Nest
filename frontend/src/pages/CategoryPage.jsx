import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();

  const user = useSelector((state) => state.user);
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const getFeedListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/properties?category=${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings.");
      }

      const data = await response.json();
      const formattedData = data.map((listing) => ({
        ...listing,
        id: listing._id,
      }));

      dispatch(setListings({ listings: formattedData }));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [category, dispatch]);

  useEffect(() => {
    if (category) {
      getFeedListings();
    }
  }, [category, getFeedListings]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{capitalize(category)} Listings</h1>

      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : listings.length === 0 ? (
        <p style={{ textAlign: "center" }}>No listings found in this category.</p>
      ) : (
        <div className="list">
          {listings.map(
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
                key={id}
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
              />
            )
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default CategoryPage;
