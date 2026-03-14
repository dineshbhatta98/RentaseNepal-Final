import React, { useState } from 'react';

const AddBlog = ({ fetchBlogs }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // Change to handle files
  const [author, setAuthor] = useState('');
  const [hook, setHook] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!title || !content || !author) {
      setError('Title, Content, and Author are required.');
      return;
    }

    // Create a FormData object to send the data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('hook', hook);
    formData.append('date', new Date().toISOString()); // Use the current date

    if (image) {
      formData.append('image', image); // Append the image file
    }

    const token = 'fdc19eacbd64d055f80b9486b4b4d1fc443f67cb'; // Use the appropriate token

    try {
      const response = await fetch('https://api.rentasenepal.com/api/blogs/', {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('New blog added successfully');
      } else {
        const errorData = await response.json();
        setError(`Failed to add blog: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding new blog:', error);
      setError('An error occurred while adding the blog.');
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  return (
    <div className="add-blog">
      <h2>Add New Blog</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Blog Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="hook">Hook (A Catchy first sentence of Blog):</label>
          <textarea
            id="hook"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="content">Main Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="summary">Summary to display on blog card:</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image">Upload Image :</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit">Add Blog</button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
