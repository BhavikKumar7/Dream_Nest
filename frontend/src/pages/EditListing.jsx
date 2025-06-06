import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
    const { id } = useParams();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [formLocation, setFormLocation] = useState({
        streetAddress: "",
        aptSuite: "",
        city: "",
        province: "",
        country: "",
    });
    const [guestCount, setGuestCount] = useState(1);
    const [bedroomCount, setBedroomCount] = useState(1);
    const [bedCount, setBedCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [amenities, setAmenities] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [existingPhotoUrls, setExistingPhotoUrls] = useState([]);
    const [formDescription, setFormDescription] = useState({
        title: "",
        description: "",
        highlight: "",
        highlightDesc: "",
        price: 0,
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchListingData = async () => {
            try {
                const res = await fetch(`http://localhost:3001/properties/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await res.json();

                setCategory(data.category);
                setType(data.type);
                setFormLocation({
                    streetAddress: data.location.streetAddress,
                    aptSuite: data.location.aptSuite,
                    city: data.location.city,
                    province: data.location.province,
                    country: data.location.country,
                });
                setGuestCount(data.guestCount);
                setBedroomCount(data.bedroomCount);
                setBedCount(data.bedCount);
                setBathroomCount(data.bathroomCount);
                setAmenities(data.amenities || []);
                setFormDescription({
                    title: data.title,
                    description: data.description,
                    highlight: data.highlight,
                    highlightDesc: data.highlightDesc,
                    price: data.price,
                });
                setExistingPhotoUrls(data.photoUrls || []);
            } catch (err) {
                console.error("Failed to fetch listing", err.message);
            }
        };

        fetchListingData();
    }, [id, navigate, user]);

    const handleUploadPhotos = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const handleRemovePhoto = (indexToRemove, isExisting = false) => {
        if (isExisting) {
            setExistingPhotoUrls((prev) =>
                prev.filter((_, index) => index !== indexToRemove)
            );
        } else {
            setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    const handleChangeLocation = (e) => {
        const { name, value } = e.target;
        setFormLocation((prevLocation) => ({
            ...prevLocation,
            [name]: value,
        }));
    };

    const handleSelectAmenities = (amenity) => {
        setAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((item) => item !== amenity)
                : [...prev, amenity]
        );
    };

    const handleDragPhoto = (result) => {
        if (!result.destination) return;
        const reordered = Array.from(photos);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setPhotos(reordered);
    };

    const handleChangeDescription = (e) => {
        const { name, value } = e.target;
        setFormDescription((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const listingForm = new FormData();
            listingForm.append("category", category);
            listingForm.append("type", type);
            listingForm.append("streetAddress", formLocation.streetAddress);
            listingForm.append("aptSuite", formLocation.aptSuite);
            listingForm.append("city", formLocation.city);
            listingForm.append("province", formLocation.province);
            listingForm.append("country", formLocation.country);
            listingForm.append("guestCount", guestCount);
            listingForm.append("bedroomCount", bedroomCount);
            listingForm.append("bedCount", bedCount);
            listingForm.append("bathroomCount", bathroomCount);
            listingForm.append("amenities", JSON.stringify(amenities));
            listingForm.append("title", formDescription.title);
            listingForm.append("description", formDescription.description);
            listingForm.append("highlight", formDescription.highlight);
            listingForm.append("highlightDesc", formDescription.highlightDesc);
            listingForm.append("price", formDescription.price);
            listingForm.append("existingPhotos", JSON.stringify(existingPhotoUrls));

            photos.forEach((photo) => {
                listingForm.append("newPhotos", photo);
            });

            const response = await fetch(`http://localhost:3001/properties/${id}`, {
                method: "PUT",
                body: listingForm,
            });

            if (response.ok) {
                navigate("/:userId/properties");
            } else {
                const errorText = await response.text();
                throw new Error(errorText || "Unknown error");
            }

        } catch (err) {
            console.log("Update Listing failed", err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-listing">
                <h1>Edit Your Listing</h1>
                <form onSubmit={handleUpdate}>
                    <div className="create-listing_step1">
                        <h2>Step 1: Tell us about your place</h2>
                        <hr />
                        <h3>Which of these categories best describes your place?</h3>
                        <div className="category-list">
                            {categories?.map((item, index) => (
                                <div
                                    className={`category ${category === item.label ? "selected" : ""
                                        }`}
                                    key={index}
                                    onClick={() => setCategory(item.label)}
                                >
                                    <div className="category_icon">{item.icon}</div>
                                    <p>{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <h3>What type of place will guests have?</h3>
                        <div className="type-list">
                            {types?.map((item, index) => (
                                <div
                                    className={`type ${type === item.name ? "selected" : ""}`}
                                    key={index}
                                    onClick={() => setType(item.name)}
                                >
                                    <div className="type_text">
                                        <h4>{item.name}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="type_icon">{item.icon}</div>
                                </div>
                            ))}
                        </div>

                        <h3>Where's your place located?</h3>
                        <div className="full">
                            <div className="location">
                                <p>Street Address</p>
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    name="streetAddress"
                                    value={formLocation.streetAddress}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <div className="half">
                            <div className="location">
                                <p>Apartment, Suite, etc. (if applicable)</p>
                                <input
                                    type="text"
                                    placeholder="Apt, Suite, etc. (if applicable)"
                                    name="aptSuite"
                                    value={formLocation.aptSuite}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                            <div className="location">
                                <p>City</p>
                                <input
                                    type="text"
                                    placeholder="City"
                                    name="city"
                                    value={formLocation.city}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <div className="half">
                            <div className="location">
                                <p>Province</p>
                                <input
                                    type="text"
                                    placeholder="Province"
                                    name="province"
                                    value={formLocation.province}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                            <div className="location">
                                <p>Country</p>
                                <input
                                    type="text"
                                    placeholder="Country"
                                    name="country"
                                    value={formLocation.country}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <h3>Share some basics about your place</h3>
                        <div className="basics">
                            <div className="basic">
                                <p>Guests</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            guestCount > 1 && setGuestCount((g) => g - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{guestCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setGuestCount((g) => g + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Bedrooms</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bedroomCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBedroomCount(bedroomCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Beds</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bedCount > 1 && setBedCount(bedCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bedCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBedCount(bedCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Bathrooms</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bathroomCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBathroomCount(bathroomCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="create-listing_step2">
                        <h2>Step 2: Make your place stand out</h2>
                        <hr />

                        <h3>Tell guests what your place has to offer</h3>
                        <div className="amenities">
                            {facilities?.map((item, index) => (
                                <div
                                    className={`facility ${amenities.includes(item.name) ? "selected" : ""
                                        }`}
                                    key={index}
                                    onClick={() => handleSelectAmenities(item.name)}
                                >
                                    <div className="facility_icon">{item.icon}</div>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>

                        <h3>Add some photos of your place</h3>
                        <DragDropContext onDragEnd={handleDragPhoto}>
                            <Droppable droppableId="photos" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="photos"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {photos.length < 1 && (
                                            <>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    accept="image/*"
                                                    onChange={handleUploadPhotos}
                                                    multiple
                                                />
                                                <label htmlFor="image" className="alone">
                                                    <div className="icon">
                                                        <IoIosImages />
                                                    </div>
                                                    <p>Upload from your device</p>
                                                </label>
                                            </>
                                        )}

                                        {photos.length >= 1 && (
                                            <>
                                                {photos.map((photo, index) => {
                                                    return (
                                                        <Draggable
                                                            key={index}
                                                            draggableId={index.toString()}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    className="photo"
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <img
                                                                        src={URL.createObjectURL(photo)}
                                                                        alt="place"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemovePhoto(index)}
                                                                    >
                                                                        <BiTrash />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                <input
                                                    id="image"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    accept="image/*"
                                                    onChange={handleUploadPhotos}
                                                    multiple
                                                />
                                                <label htmlFor="image" className="together">
                                                    <div className="icon">
                                                        <IoIosImages />
                                                    </div>
                                                    <p>Upload from your device</p>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <h3>What makes your place attractive and exciting?</h3>
                        <div className="description">
                            <p>Title</p>
                            <input
                                type="text"
                                placeholder="Title"
                                name="title"
                                value={formDescription.title}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Description</p>
                            <textarea
                                type="text"
                                placeholder="Description"
                                name="description"
                                value={formDescription.description}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Highlight</p>
                            <input
                                type="text"
                                placeholder="Highlight"
                                name="highlight"
                                value={formDescription.highlight}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Highlight details</p>
                            <textarea
                                type="text"
                                placeholder="Highlight details"
                                name="highlightDesc"
                                value={formDescription.highlightDesc}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Now, set your PRICE</p>
                            <span>$</span>
                            <input
                                type="number"
                                placeholder="100"
                                name="price"
                                value={formDescription.price}
                                onChange={handleChangeDescription}
                                className="price"
                                required
                            />
                        </div>
                    </div>

                    <button className="submit_btn" type="submit">
                        UPDATE YOUR LISTING
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditListing;
