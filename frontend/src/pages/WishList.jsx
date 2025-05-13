import { useEffect, useState } from "react";
import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchWishList();
    }
  }, [user, navigate]);

  const fetchWishList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/wishlist`);

      if (response.ok) {
        const data = await response.json();
        setWishList(data);
      } else {
        console.error("Failed to fetch wish list");
      }
    } catch (err) {
      console.error("Error fetching wish list:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>
      <div className="list">
        {wishList.length > 0 ? (
          wishList.map(
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
                key={_id}
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
              />
            )
          )
        ) : (
          <p>No listings in your wish list.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishList;
