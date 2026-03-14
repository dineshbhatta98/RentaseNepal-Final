import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import blogs from "../data/blogs.json";
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]); // State to store blogs
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to show loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const { id } = useParams();

  useEffect(() => {

    // Fetch blogs from the Django backend
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://api.rentasenepal.com/api/blogs/'); // Update with your backend URL
        const responseBlog = await axios.get(`https://api.rentasenepal.com/api/blogs/${id}/`);
        setBlogs(response.data.blogs); // Set blogs data
        setBlog(responseBlog.data);
        console.log(
          "gelle"
        );
        // console.log(response.data.blogs);
        setIsLoading(false); // Loading done
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [id]);

  if (isLoading) {
    return <div>Loading blogs...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }



  // const blog = blogs.find(blog => blog.id === Number(id));

  const formattedDate = new Date(blog.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const mostViewedBlogs = blogs.filter(blog => blog.id !== Number(id)).sort((a, b) => b.views - a.views).slice(0, 5);


  // console.log(mostViewedBlogs);
  return (
    <div className="blog-body">
      <div className="blogmain-container">
        {/* Blog Container */}
        <div className="blog-container">
          <h2>{blog.title}</h2>

          <div className="blog-meta">
            <span className="date">{formattedDate}</span>
            <span className="views">
              <i className="bi bi-eye-fill"></i> {blog.views} Views
            </span>
          </div>
          {console.log(blog.image)}
          <img src={blog.image} alt={blog.title} className="blog-main-image" />

          <div className="blog-content">
            <p>{blog.hook}</p>
            {/* {blog.hooks.map((hook, index) => (
                <p key={`hook-${index}`}>{hook}</p>
              ))} */}
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={`content-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Most Viewed Section */}
        <div className="blog-most-viewed">
          <h2>Most Viewed</h2>
          {mostViewedBlogs.map((mostViewedBlog, index) => (
            <div className="blog-most-viewed-item" key={`most-viewed-${index}`}>
              <img src={mostViewedBlog.image} alt="Thumbnail" />
              <div className="blog-content">
                <h3><Link to={`/blog/${mostViewedBlog.id}`}>{mostViewedBlog.title}</Link></h3>
                <div className="date">{
                  new Date(mostViewedBlog.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                  }</div>
                <div className="views">
                  <i className="bi bi-eye-fill"></i> {mostViewedBlog.views} Views
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Follow Us Section */}
      </div>
      <div className="blog-follow-us-section">
        <h3>Follow Us</h3>
        <div className="blog-social-icons">
          <a href="https://www.facebook.com/profile.php?id=61559722175314" className="facebook"><i className="bi bi-facebook"></i></a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rentasenepal@gmail.com" target="_blank"><i className="bi bi-envelope"></i></a>
          <a href="https://wa.me/9779763271690" target="_blank" className="whatsapp"><i className="bi bi-whatsapp"></i></a>
          <a href="https://www.instagram.com/rentase_nepal/" className="instagram"><i className="bi bi-instagram"></i></a>
        </div>
      </div>
    </div>
  );
};

export default Blog;
