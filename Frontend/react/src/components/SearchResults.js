import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import HostelCard from './HostelCard';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locationQuery = queryParams.get('location') || '';
  const lat = queryParams.get('lat') || '';
  const lon = queryParams.get('lon') || '';

  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [gender, setGender] = useState(2);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [unfilteredHostels, setUnfilteredHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const priceSliderRef = useRef(null);
  const sliderInstanceRef = useRef(null);

  const toggleFilterVisibility = () => {
    setFilterVisible((prev) => !prev);
  };

  useEffect(() => {
    if (windowWidth < 768) { // Consider mobile devices as screen width < 768px
      setFilterVisible(false);
    } else {
      setFilterVisible(true);
    }
  }, [windowWidth]);

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize the slider
  useEffect(() => {
    if (priceSliderRef.current && !sliderInstanceRef.current) {
      sliderInstanceRef.current = noUiSlider.create(priceSliderRef.current, {
        start: priceRange,
        connect: true,
        range: {
          min: 0,
          max: 25000,
        },
        step: 500,
        tooltips: [true, true],
        format: {
          to: (value) => Math.round(value),
          from: (value) => Number(value),
        },
      });

      // Add event listener
      sliderInstanceRef.current.on('change', (values) => {
        setPriceRange([parseInt(values[0]), parseInt(values[1])]);
      });
    }

    return () => {
      if (sliderInstanceRef.current) {
        sliderInstanceRef.current.destroy();
        sliderInstanceRef.current = null;
      }
    };
  }); // Empty dependency array since we only want to initialize once

  // Update slider values when priceRange changes from outside the slider
  useEffect(() => {
    if (sliderInstanceRef.current) {
      const currentValues = sliderInstanceRef.current.get();
      const newValues = priceRange.map(String);

      // Only update if values are different to prevent loops
      if (currentValues[0] !== newValues[0] || currentValues[1] !== newValues[1]) {
        sliderInstanceRef.current.set(newValues);
      }
    }
  }, [priceRange]);

  const fetchFilteredHostels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const payload = locationQuery ? {

      gender: parseInt(gender), // 0: Female, 1: Male, 2: Any
      max_price: priceRange[1],
      min_price: priceRange[0],
      location: locationQuery,
      // Additional filters can be added as required
    } : {
      gender: parseInt(gender), // 0: Female, 1: Male, 2: Any
      max_price: priceRange[1],
      min_price: priceRange[0],
      distance: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
      // Additional filters can be added as required
    };
    console.log(JSON.stringify(payload));

    try {
      const token=localStorage.getItem('admin-token') || localStorage.getItem('user-token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if the token exists
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }
      const response = await fetch('https://api.rentasenepal.com/api/hostels/filter/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch hostels. Please try again.');
      }
      const data = await response.json();
      console.log(data);
      setFilteredHostels(data);
      setUnfilteredHostels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [priceRange, gender, locationQuery, lat, lon]);

  useEffect(() => {
    fetchFilteredHostels();
  }, [fetchFilteredHostels]);


  // Memoized filter and sort function
  const filterAndSortHostels = useCallback(() => {
    let result = unfilteredHostels.filter((hostel) => {
      return hostel.rating >= minRating;
    });

    result = result.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.admission_price - b.admission_price : b.admission_price - a.admission_price;
      }
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    });

    return result;
  }, [unfilteredHostels, minRating, sortBy, sortOrder]);

  useEffect(() => {
    console.log(minRating);
    setFilteredHostels(filterAndSortHostels());
  }, [minRating, sortBy, sortOrder, filterAndSortHostels]);

  const resetFilters = () => {
    setPriceRange([0, 15000]);
    setGender(2);
    setMinRating(0);
    setSortBy('price');
    setSortOrder('asc');
  };

  if (error) {
    return <div className="search-results">{error}</div>;
  }
  if (loading) {
    return <div className="search-results">Loading Featured Hostels...</div>;
  }

  return (
    <>
      <div className="search-results">
        {/* Hamburger button for mobile */}
        <button className="hamburger-btn"  onClick={toggleFilterVisibility}>
          {filterVisible ? (
            <p>
              Hide and Apply
            </p>
          ) : (
            <p>
              Show Filters <i className="bi bi-funnel-fill" />
            </p>
          )} {/* Hamburger icon */}
        </button>

        <div className={`filters ${filterVisible ? 'visible' : 'hidden'}`}>
          <div className="filter-section">


            <h2 className="filters-title">Filters <i className="bi bi-funnel-fill" /></h2>

            <div className="filter-option">
              <label>Price: Rs. {priceRange[0]} - Rs. {priceRange[1]}</label>
              <div ref={priceSliderRef} style={{ marginBottom: '10px', marginTop: '50px' }}></div>
            </div>

            <div className="filter-option">
              <label>Gender:</label>
              <select onChange={(e) => setGender(e.target.value)} value={gender}>
                <option value={2}>All</option>
                <option value={1}>Boys</option>
                <option value={0}>Girls</option>
                {/* <option value="Co-ed">Co-ed</option> */}
              </select>
            </div>

            <div className="filter-option">
              <label>Minimum Rating:</label>
              <select onChange={(e) => setMinRating(Number(e.target.value))} value={minRating}>
                <option value={0}>All</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>
          </div>

          <div className="sort-section">
            <label>Sort By</label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>

            <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <button onClick={resetFilters} className="reset-filters">Reset Filters</button>
        </div>

        <div className="hostel-grid">
          {filteredHostels.length > 0 ? (
            filteredHostels.map((hostel) => (
              <HostelCard
                key={hostel.id}
                id={hostel.id}
                image={hostel.image}
                name={hostel.name}
                isFeatured={hostel.isFeatured}
                rating={hostel.rating}
                location={hostel.location}
                price={hostel.admission_price}
                gender={hostel.gender}
              />
            ))
          ) : (
            <p>No hostels found based on your search criteria.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;