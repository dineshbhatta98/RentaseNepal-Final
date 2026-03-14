import React, { useEffect, useState }  from 'react';
import axios from 'axios';
// import blogs from '../data/blogs.json';
import BlogCard from "./BlogCard";
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]); // State to store blogs
  const [isLoading, setIsLoading] = useState(true); // State to show loading indicator
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch blogs from the Django backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://api.rentasenepal.com/api/blogs/'); // Update with your backend URL
        setBlogs(response.data.blogs); // Set blogs data
        setIsLoading(false); // Loading done
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return <div>Loading blogs...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }




  return (
    <div className="blogs-section">
      <h2>Our Latest Blogs</h2>
      <Swiper 
        style={{
          padding:"40px",
      }}
        className="blogs-container"
        slidesPerView={3}
        slidesPerGroup={3}
        spaceBetween={28}
        loop={true}
        fadeEffect={true}
        grabCursor={true}
        pagination={{ clickable: true, dynamicBullets: true, }}
        breakpoints={{
            0: {slidesPerView: 1, slidesPerGroup:1,},
            520: {slidesPerView: 2, slidesPerGroup:2,},
            950: {slidesPerView: 3, slidesPerGroup:3,},
        }}
        modules={[Pagination]}
      >
        {blogs.map((blog, index) => (
          <SwiperSlide>
          <BlogCard 
          key={blog.id}
          blog={blog}
          />
          </SwiperSlide>
          
        ))}
      </Swiper>
    </div>
  );
};

export default Blogs;
