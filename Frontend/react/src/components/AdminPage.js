import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminPage = ({ setisLoggedIn, setUserRole }) => {
  const [hostels, setHostels] = useState([]);
  const [filter, setFilter] = useState('all'); // Default filter
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('admin-token');

  useEffect(() => {
    if (!token) {
      setisLoggedIn(false);
      setUserRole('user');
      navigate('/login');
    } else {
      fetchHostels();
      fetchBlogs();
    }
  }, [navigate, setisLoggedIn, setUserRole]);

  // Fetch hostels with the selected filter
  const fetchHostels = async () => {
    const token = localStorage.getItem('admin-token');
    let filters = {};
    if (filter === 'all') filters = {};
    else if (filter === 'approved') filters = { approved: true };
    else if (filter === 'unapproved') filters = { approved: false };
    else if (filter === 'featured') filters = { isFeatured: true };
    else if (filter === 'unfeatured') filters = { isFeatured: false };

    try {
      const response = await fetch('https://api.rentasenepal.com/api/hostels/filter/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      // console.log(data);
      setHostels(data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [filter]);

  // Approve hostel
  const approveHostel = async (id) => {
    try {
      const response = await fetch(`https://api.rentasenepal.com/api/hostels/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ approved: true }),
      });
      if (response.ok) {
        alert('Hostel approved successfully');
        fetchHostels();
      }
    } catch (error) {
      console.error('Error approving hostel:', error);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id, isFeatured) => {
    try {
      // const token = localStorage.getItem('admin-token');
      const response = await fetch(`https://api.rentasenepal.com/api/hostels/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (response.ok) {
        alert(`Hostel ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
        fetchHostels();
      } else {
        const errorData = await response.json();
        alert(`Failed to update featured status: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };


  // Delete hostel
  const deleteHostel = async (id) => {
    try {
      // const token = localStorage.getItem('admin-token');
      const response = await fetch(`https://api.rentasenepal.com/api/hostels/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
          Authorization: `token ${token}`, // Add the authorization token
        },
      });
      if (response.ok) {
        alert('Hostel deleted successfully');
        fetchHostels();
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('https://api.rentasenepal.com/api/blogs/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.blogs);
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`https://api.rentasenepal.com/api/blogs/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
      });
      if (response.ok) {
        alert('Blog deleted successfully');
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Handle adding a new blog (for simplicity, just a placeholder for now)
  const handleAddBlog = () => {
    // Add blog logic here, e.g., redirecting to a form or showing a modal
    navigate('/add-blog');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setisLoggedIn(false);
    setUserRole('user');
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>

      {/* Filter Dropdown */}
      <div className="filters">
        <label>
          Filter Hostels:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Hostels</option>
            <option value="approved">Approved Hostels</option>
            <option value="unapproved">Unapproved Hostels</option>
            <option value="featured">Featured Hostels</option>
            <option value="unfeatured">Unfeatured Hostels</option>
          </select>
        </label>
      </div>

      {/* Hostels Table */}
      <div className="table-section">
        <h3>Hostels</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hostel Name</th>
                <th>Approval</th>
                <th>Feature</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel) => (
                <tr key={hostel.id}>
                  {/* Hostel Name as a clickable link */}
                  <td>
                    <Link to={`/hostel/${hostel.id}`}>
                      {hostel.name}
                      {/*`Hostel ${parseInt(1000 + hostel.id)}`*/}
                    </Link>
                  </td>

                  {/* Approval column */}
                  <td>
                    {hostel.approved ? (
                      <span style={{ color: 'green' }}>✔</span>
                    ) : (
                      <button onClick={() => approveHostel(hostel.id)}>Approve</button>
                    )}
                  </td>

                  {/* Feature column */}
                  <td>
                    {hostel.approved ? (
                      <button onClick={() => toggleFeatured(hostel.id, hostel.isFeatured)}>
                        {hostel.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                    ) : (
                      <button disabled style={{ opacity: 0.5 }}>Feature</button>
                    )}
                  </td>

                  {/* Delete button */}
                  <td>
                    <button onClick={() => deleteHostel(hostel.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br/>
      <br/>
      {/* Blogs Table */}
      <div className="table-section">
        <h3>Blogs</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Blog Title</th>
                {/* <th>Edit</th> */}
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <Link to={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer">
                      {blog.title}
                    </Link>
                  </td>
                  {/* <td>
                    <button onClick={() => navigate(`/edit-blog/${blog.id}`)}>Edit</button>
                  </td> */}
                  <td>
                    <button onClick={() => deleteBlog(blog.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Blog Button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleAddBlog}>Add New Blog</button>
      </div>
    </div>
  );
};

export default AdminPage;
