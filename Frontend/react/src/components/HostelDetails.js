
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import hostels from "../data/hostels.json"; 

const HostelDetails = ({ userRole }) => {
  console.log(userRole);
  const { id } = useParams(); // Get the hostel ID from the URL
  const [hostel, setHostel] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allAmenities = [
    { value: "WiFi", name: "internet", emoji: "📶" },
    { value: "Air Conditioning", name: "ac", emoji: "❄️" },
    { value: "Washing Machine", name: "washing_machine", emoji: "🧺" },
    { value: "Bathroom Cleaning", name: "bathroom_cleaning", emoji: "🧽" },
    { value: "Study Table", name: "study_table", emoji: "🖥️" },
    { value: "Book Rack", name: "books_rack", emoji: "📚" },
    { value: "Wardrobe", name: "wardrobe", emoji: "👗" },
    { value: "Clothes Hanger", name: "clothes_hanger", emoji: "👚" },
    { value: "Parking", name: "parking_space", emoji: "🚗" },
    { value: "Mess", name: "mess", emoji: "🍽️" },
    { value: "CCTV", name: "cctv", emoji: "📷" },
    { value: "Power Backup", name: "generator", emoji: "🔌" },
    { value: "Geyser", name: "geysers", emoji: "🚿" },
    { value: "Heater", name: "heater", emoji: "🔥" },
    { value: "Gym", name: "gym", emoji: "💪" },
    { value: "Security Guard", name: "security_guard", emoji: "🛡️" },
    { value: "Lift", name: "lift", emoji: "🛗" },
    { value: "Water Cooler", name: "cooler", emoji: "🚰" },
  ];


  const fetchHostel = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('user-token');
      const headers = {
        'Content-Type': 'application/json',
      };

      // Only add Authorization header if the token exists
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const response = await fetch(`https://api.rentasenepal.com/api/hostels/${id}/`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hostels. Please try again.');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Hostel not found');
      }
      setHostel(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading Hostel Details...</div>;
  }

  if (!hostel) {
    return <div>No Hostel Details Available</div>;
  }


  // useEffect(() => {
  //   // Find the hostel by ID from the list of hostels
  //   const selectedHostel = hostels.find((hostel) => hostel.id === parseInt(id));
  //   if (selectedHostel) {
  //     setHostel(selectedHostel);
  //   }
  // }, [id]);

  // if (!hostel) {
  //   return <p>Loading...</p>; // display a loading state until data is available
  // }

  const openGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${hostel.latitude},${hostel.longitude}`, "_blank");
  };

  const showMorePhotos = () => {
    const galleryContainer = document.querySelector(".additional-images");
    const extraGallery = document.getElementById("extraGallery");
    galleryContainer.classList.toggle("show-extra");
    extraGallery.style.display = extraGallery.style.display === "grid" ? "none" : "grid";
  };

  const enquire = () => {
    // alert('Contact our representative with the hostel ID');
    console.log(`${hostel.name} added to wishlist!`);

    // Open the Messenger link in a new tab
    window.open('https://m.me/312376875293075', '_blank');
  };
  return (
    <>
      <div className="hostelmain-container">
        {hostel.name ? (<h2>{hostel.name}</h2>) :
          (<h2>Hostel {parseInt(1000) + parseInt(id)}</h2>)}

        <br />
        <div className="hostelmain-content">
          <div className="left-section">
            {/* Gallery */}
            <div className="hosteldetail-gallery">
              <div className="hosteldetail-gallery-item">
                <img src={hostel.image} alt='profile image' />
              </div>
              {hostel.additional_image.slice(0, 2).map((photo, index) => (
                <div key={index} className="hosteldetail-gallery-item">
                  <img src={photo.image} alt={`Room ${index + 1}`} />
                </div>
              ))}

              <div className="hosteldetail-gallery-item additional-images" onClick={showMorePhotos}>
                <img src={hostel.additional_image[2].image} alt="More Images" className="main-photo" />
                <div className="main-photo-overlay">+{hostel.additional_image.length - 2}</div>
              </div>
            </div>

            {/* Extra Gallery */}
            <div className="hosteldetail-extra-gallery" id="extraGallery">
              {hostel.additional_image.slice(3).map((photo, index) => (
                <img key={index} src={photo.image} alt={`Extra ${index + 1}`} />
              ))}
            </div>

            {/* Location */}
            <div className="location-wrapper">
              <p>
                <i className="bi bi-geo-alt-fill"></i> {hostel.location}
              </p>
              <button className="toggle-button" onClick={enquire}>
                Inquire now <i className="bi bi-suit-heart"></i>
              </button>
            </div>

            {/* Details */}
            <div className="hosteldetail-container">
              {/* Fee Structure */}
              <div className="hosteldetail-info">
                <div className="hosteldetail-title">Fee Structure</div>
                {hostel.admission_price > 0 && <li>Admission Fee: NPR {hostel.admission_price}</li>}
                {hostel.single_seater_price_min > 0 && <li>One-seater: NPR {hostel.single_seater_price_min} - {hostel.single_seater_price_max}</li>}
                {hostel.two_seater_price_min > 0 && <li>Two-seater: NPR {hostel.two_seater_price_min} - {hostel.two_seater_price_max}</li>}
                {hostel.three_seater_price_min > 0 && <li>Three-seater: NPR {hostel.three_seater_price_min} - {hostel.three_seater_price_max}</li>}
                {hostel.four_seater_price_min > 0 && <li>Four-seater: NPR {hostel.four_seater_price_min} - {hostel.four_seater_price_max}</li>}
              </div>

              {/* Facilities */}
              <div className="hosteldetail-info">
                <div className="hosteldetail-title">Facilities</div>
                {allAmenities.map((amenity) => (
                  hostel[amenity.name] && (
                    <li key={amenity.name}>
                      <span>{amenity.emoji}</span> {amenity.value}
                    </li>
                  )
                ))}
              </div>


              {/* Nearby Facilities */}
              <div className="hosteldetail-info">
                <div className="hosteldetail-title">Nearby Facilities</div>
                <li>
                  <i className="bi bi-bus-front"></i>
                  Transportation/Bus stations: {hostel.transportation_bus_stations}
                </li>
                <li>
                  <i className="bi bi-hospital"></i>
                  Nearby hospital or pharmacy: {hostel.nearby_hospitals_pharmacy}
                </li>
                <li>
                  <i className="bi bi-book-half"></i>
                  Nearby Schools: {hostel.nearby_schools}
                </li>
                <li>
                  <i className="bi bi-bag"></i>
                  Nearby shopping malls: {hostel.nearby_shopping_malls}
                </li>
                <li>
                  <i className="bi bi-cup-hot"></i>
                  Nearby Cafes and Restaurants: {hostel.nearby_cafes_and_restaurants}
                </li>
              </div>

              {/* Rules */}
              <div className="hosteldetail-info">
                <div className="hosteldetail-title">Rules</div>
                <div className="rule">
                  <div className="rule-icon-box">
                    <p>
                      <i className="bi bi-alarm"></i>
                    </p>
                    <p>Arrival time: {hostel.arrival_time}</p>
                  </div>
                  {hostel.rules && hostel.rules.split('\n').map((rule, index) => (
                    <div key={index} className="rule-icon-box">
                      <p>
                        <i className="bi bi-exclamation-octagon"></i>
                      </p>
                      <p>{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            {/* Description */}
            <div className="hostel-description hosteldetail-info">
              <div className="hosteldetail-title">About This Hostel</div>
              <p>{hostel.description}</p>
            </div>
            {/* Map */}
            {userRole === 'admin' && (<div className="map-box hosteldetail-info">
              <div className="hosteldetail-title">Location</div>
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${hostel.latitude},${hostel.longitude}`}
                width="600"
                height="450"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

            </div>
            )}
            {userRole === 'admin' && (<button className="toggle-button" onClick={openGoogleMaps}>
              View on Google Maps
            </button>
            )}

            {/* Mess Menu */}
            <div className="mess-menu hosteldetail-info">
              <div className="hosteldetail-title">Mess Menu</div>
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Snacks</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(hostel.food_menu).map(([day, meals], index) => (
                    <tr key={index}>
                      <td>{day}</td>
                      <td>{meals.Breakfast || "N/A"}</td>
                      <td>{meals.Lunch || "N/A"}</td>
                      <td>{meals.Snacks || "N/A"}</td>
                      <td>{meals.Dinner || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostelDetails;
