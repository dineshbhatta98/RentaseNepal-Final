
import React from 'react';
import HostelCard from './HostelCard';
import '../style.css';
// import hostels from '../data/hostels.json';
import { useState, useEffect } from 'react';

import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const FeaturedHostels = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('admin-token')

  const fetchFeaturedHostels = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      approved: true,
      isFeatured: true,
    };

    try {
      const response = await fetch('https://api.rentasenepal.com/api/hostels/filter/', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `token ${token}` }),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hostels. Please try again.');
      }

      const data = await response.json();
      setFeatured(data || []);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedHostels();
  }, []);

  if(error){
    return <div className="featuredhostel-section">{error}</div>;
  }
  if(loading){
    return <div className="featuredhostel-section">Loading Featured Hostels...</div>;
  }

  return (
    featured.filter(hostel => hostel.isFeatured).length ? (
      <div className="featuredhostel-section">
        <h2>Featured Hostels</h2>

        <Swiper
          style={{
            padding: "60px",
            overflow: "hidden"
          }}
          className="scrollable-cards-wrapper"
          slidesPerView={3}
          slidesPerGroup={3}
          spaceBetween={25}
          loop={true}
          fadeEffect={true}
          grabCursor={true}
          pagination={{ clickable: true, dynamicBullets: true, }}
          navigation={true}
          breakpoints={{
            0: {slidesPerView: 1, slidesPerGroup:1,},
            520: {slidesPerView: 2, slidesPerGroup:2,},
            950: {slidesPerView: 3, slidesPerGroup:3,},
          }}
          modules={[Pagination, Navigation]}
        >
          {featured.filter(hostel => hostel.isFeatured).map((hostel, index) => (
            <SwiperSlide>
              <HostelCard
                key={index}
                id={hostel.id}
                image={hostel.image}
                name={hostel.name}
                isFeatured={hostel.isFeatured}
                rating={hostel.rating}
                location={hostel.location}
                price={hostel.admission_price}
                gender={hostel.gender}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    ) : (
      <div className="featuredhostel-section">No Hostels Featured</div>
    )
  );
};

export default FeaturedHostels;
