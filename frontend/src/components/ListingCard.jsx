// import { useState } from "react";
// import "../styles/ListingCard.scss";
// import {
//   ArrowForwardIos,
//   ArrowBackIosNew,
//   Favorite,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { setWishList } from "../redux/state";

// const ListingCard = ({
//   tripId,
//   listingId,
//   creator,
//   listingPhotoPaths,
//   city,
//   province,
//   country,
//   category,
//   type,
//   price,
//   startDate,
//   endDate,
//   totalPrice,
//   booking,
//   showCancel = false,
//   onCancel = () => { },
//   expandable = false,
//   isExpanded = false,
//   onToggleExpand = () => { },
//   onEdit = null,
//   onDelete = null,
//   hideBooking = false,
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goToPrevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
//     );
//   };

//   const goToNextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
//   };

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.user);
//   const wishList = user?.wishList || [];

//   const isLiked = wishList?.find((item) => item?.id === listingId);
//   const patchWishList = async () => {
//     if (user?.id !== creator.id) {
//       const response = await fetch(
//         `http://localhost:3001/users/${user?.id}/${listingId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.json();
//       dispatch(setWishList(data.wishList));
//     } else {
//       return;
//     }
//   };

//   return (
//     <div
//       className="listing-card"
//       onClick={
//         expandable
//           ? onToggleExpand
//           : () => {
//             if (!hideBooking) {
//               navigate(`/properties/${listingId}`);
//             }
//           }
//       }
//     >
//       <div className="slider-container">
//         <div
//           className="slider"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {listingPhotoPaths?.map((photo, index) => (
//             <div key={index} className="slide">
//               <img
//                 src={`http://localhost:3001/${photo?.replace("public", "")}`}
//                 alt={`photo ${index + 1}`}
//               />
//               <div
//                 className="prev-button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToPrevSlide(e);
//                 }}
//               >
//                 <ArrowBackIosNew sx={{ fontSize: "15px" }} />
//               </div>
//               <div
//                 className="next-button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToNextSlide(e);
//                 }}
//               >
//                 <ArrowForwardIos sx={{ fontSize: "15px" }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <h3>
//         {city}, {province}, {country}
//       </h3>
//       <p>{category}</p>

//       {!booking ? (
//         <>
//           <p>{type}</p>
//           <p>
//             <span>${price}</span> per night
//           </p>
//         </>
//       ) : (
//         <>
//           <p>
//             {startDate} - {endDate}
//           </p>
//           <p>
//             <span>${totalPrice}</span> total
//           </p>
//         </>
//       )}

//       {isExpanded && (
//         <div className="trip-details-dropdown">
//           <p><strong>Trip ID:</strong> {tripId}</p>
//           <p><strong>Listing ID:</strong> {listingId}</p>
//           <p><strong>Host ID:</strong> {creator}</p>
//           <p><strong>Start Date:</strong> {startDate}</p>
//           <p><strong>End Date:</strong> {endDate}</p>
//           <p><strong>Total Price:</strong> ${totalPrice}</p>
//         </div>
//       )}

//       {showCancel && (
//         <button
//           className="cancel-trip-btn"
//           onClick={(e) => {
//             e.stopPropagation();
//             onCancel(listingId);
//           }}
//         >
//           ✖
//         </button>
//       )}


//       <button
//         className="favorite"
//         onClick={(e) => {
//           e.stopPropagation();
//           patchWishList();
//         }}
//         disabled={!user}
//       >
//         {isLiked ? (
//           <Favorite sx={{ color: "red" }} />
//         ) : (
//           <Favorite sx={{ color: "white" }} />
//         )}
//       </button>

//       {(onEdit || onDelete) && (
//         <div className="listing-card-actions">
//           {onEdit && (
//             <button
//               className="edit-btn"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit(listingId);
//               }}
//             >
//               ✎ Edit
//             </button>
//           )}
//           {onDelete && (
//             <button
//               className="delete-btn"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(listingId);
//               }}
//             >
//               🗑 Delete
//             </button>
//           )}
//         </div>
//       )}


//     </div>
//   );
// };

// export default ListingCard;

import { useState, useEffect } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

const ListingCard = ({
  tripId,
  listingId,
  creator = null,
  listingPhotoPaths = [],
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  bookingUserId,
  showCancel = false,
  onCancel = () => {},
  expandable = false,
  isExpanded = false,
  onToggleExpand = () => {},
  onEdit = null,
  onDelete = null,
  hideBooking = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookingUser, setBookingUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?.id === listingId);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const patchWishList = async () => {
    if (user?.id && creator?.id && user?.id !== creator?.id) {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user?.id}/${listingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        dispatch(setWishList(data.wishList));
      } catch (err) {
        console.error("Failed to patch wishlist:", err);
      }
    }
  };

  useEffect(() => {
    const fetchBookingUser = async () => {
      if (user?.id && creator?.id && user?.id === creator.id && booking && bookingUserId) {
        try {
          const res = await fetch(`http://localhost:3001/users/${bookingUserId}`);
          const data = await res.json();
          const { password, ...rest } = data;
          setBookingUser(rest);
        } catch (err) {
          console.error("Failed to fetch booking user:", err);
        }
      }
    };

    fetchBookingUser();
  }, [user?.id, creator?.id, booking, bookingUserId]);

  return (
    <div
      className="listing-card"
      onClick={
        expandable
          ? onToggleExpand
          : () => {
              if (!hideBooking) {
                navigate(`/properties/${listingId}`);
              }
            }
      }
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3001/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>{city}, {province}, {country}</h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>{startDate} - {endDate}</p>
          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      {isExpanded && (
        <div className="trip-details-dropdown">
          <p><strong>Trip ID:</strong> {tripId}</p>
          <p><strong>Listing ID:</strong> {listingId}</p>
          <p><strong>Host ID:</strong> {creator?.id || "N/A"}</p>
          <p><strong>Start Date:</strong> {startDate}</p>
          <p><strong>End Date:</strong> {endDate}</p>
          <p><strong>Total Price:</strong> ${totalPrice}</p>
        </div>
      )}

      {user?.id === creator?.id && bookingUser && (
        <div className="booking-user-details">
          <hr />
          <h4>Guest Info</h4>
          <p><strong>Name:</strong> {bookingUser.firstName} {bookingUser.lastName}</p>
          <p><strong>Email:</strong> {bookingUser.email}</p>
          <p><strong>User ID:</strong> {bookingUser.id}</p>
        </div>
      )}

      {showCancel && (
        <button
          className="cancel-trip-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCancel(listingId);
          }}
        >
          ✖
        </button>
      )}

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>

      {(onEdit || onDelete) && (
        <div className="listing-card-actions">
          {onEdit && (
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(listingId);
              }}
            >
              ✎ Edit
            </button>
          )}
          {onDelete && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(listingId);
              }}
            >
              🗑 Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingCard;