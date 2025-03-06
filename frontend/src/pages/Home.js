import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [rating, setRating] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [location, setLocation] = useState({
    city: "",
    district: "",
    address: ""
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, cuisine, dietaryRestrictions, spiceLevel, rating, priceMin, priceMax, location]);

  useEffect(() => {
    setPage(1);
    setDisplayedRestaurants(filteredRestaurants.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredRestaurants.length > ITEMS_PER_PAGE);
  }, [filteredRestaurants]);

  const lastRestaurantElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newRestaurants = filteredRestaurants.slice(startIndex, endIndex);
      setDisplayedRestaurants(prev => [...prev, ...newRestaurants]);
      setHasMore(endIndex < filteredRestaurants.length);
    }
  }, [page, filteredRestaurants]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/restaurants");
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location.city) {
      filtered = filtered.filter((r) =>
        r.location.city.toLowerCase().includes(location.city.toLowerCase())
      );
    }

    if (location.district) {
      filtered = filtered.filter((r) =>
        r.location.district.toLowerCase().includes(location.district.toLowerCase())
      );
    }

    if (location.address) {
      filtered = filtered.filter((r) =>
        r.location.address.toLowerCase().includes(location.address.toLowerCase())
      );
    }

    if (cuisine) {
      filtered = filtered.filter((r) => r.menu.some((item) => item.cuisine === cuisine));
    }

    if (dietaryRestrictions) {
      filtered = filtered.filter((r) =>
        r.menu.some((item) => item.dietaryRestrictions.includes(dietaryRestrictions))
      );
    }

    if (spiceLevel) {
      filtered = filtered.filter((r) =>
        r.menu.some((item) => item.spiceLevel === parseInt(spiceLevel))
      );
    }

    if (rating) {
      filtered = filtered.filter((r) => r.rating >= parseFloat(rating));
    }

    if (priceMin || priceMax) {
      filtered = filtered.filter((r) =>
        r.menu.some((item) => {
          const price = item.price;
          return price >= (priceMin ? parseFloat(priceMin) : 0) && price <= (priceMax ? parseFloat(priceMax) : Infinity);
        })
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-3" style={{ color: '#2E7D32' }}>Find Your Perfect Restaurant</h1>
          <p className="lead text-muted">Discover amazing restaurants based on your preferences</p>
        </div>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-search text-success"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-map-marker-alt text-success"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by city..."
              name="city"
              value={location.city}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-utensils text-success"></i>
            </span>
            <select 
              className="form-select border-start-0" 
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="">Filter by Cuisine</option>
              <option value="Asian">Asian</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-leaf text-success"></i>
            </span>
            <select 
              className="form-select border-start-0" 
              onChange={(e) => setDietaryRestrictions(e.target.value)}
            >
              <option value="">Filter by Dietary Restrictions</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-fire text-success"></i>
            </span>
            <select 
              className="form-select border-start-0" 
              onChange={(e) => setSpiceLevel(e.target.value)}
            >
              <option value="">Filter by Spice Level</option>
              <option value="0">Mild</option>
              <option value="1">Medium</option>
              <option value="2">Spicy</option>
              <option value="3">Extra Spicy</option>
              <option value="4">Extreme</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-star text-success"></i>
            </span>
            <input
              type="number"
              className="form-control border-start-0"
              placeholder="Minimum Rating"
              min="0"
              max="5"
              step="0.1"
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row">
        {displayedRestaurants.map((restaurant, index) => (
          <div 
            key={restaurant._id} 
            className="col-md-6 mb-4"
            ref={index === displayedRestaurants.length - 1 ? lastRestaurantElementRef : null}
          >
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header bg-success text-white py-3">
                <h5 className="card-title mb-0">
                  <Link to={`/restaurants/${restaurant._id}`} className="text-white text-decoration-none">
                    {restaurant.name}
                  </Link>
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <p className="mb-1">
                      <i className="fas fa-map-marker-alt text-success me-2"></i>
                      {restaurant.location.city}, {restaurant.location.district}
                    </p>
                    <p className="mb-0 text-muted small">
                      <i className="fas fa-map text-success me-2"></i>
                      {restaurant.location.address}
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-star text-warning me-1"></i>
                      <span className="fw-bold">{restaurant.rating}</span>
                      <span className="text-muted ms-1">/ 5</span>
                    </div>
                  </div>
                </div>

                <div className="menu-section">
                  <h6 className="text-success mb-3">
                    <i className="fas fa-utensils me-2"></i>
                    Menu Items
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th className="border-0">Name</th>
                          <th className="border-0">Cuisine</th>
                          <th className="border-0">Dietary</th>
                          <th className="border-0">Spice</th>
                          <th className="border-0">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {restaurant.menu.map((item, index) => (
                          <tr key={index}>
                            <td className="border-0">{item.name}</td>
                            <td className="border-0">{item.cuisine}</td>
                            <td className="border-0">
                              {item.dietaryRestrictions.map((restriction, i) => (
                                <span key={i} className="badge bg-success bg-opacity-10 text-success me-1">
                                  {restriction}
                                </span>
                              ))}
                            </td>
                            <td className="border-0">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-fire ${i < item.spiceLevel ? 'text-danger' : 'text-muted'}`}
                                ></i>
                              ))}
                            </td>
                            <td className="border-0 fw-bold text-success">${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {!hasMore && displayedRestaurants.length > 0 && (
        <div className="text-center my-4">
          <p className="text-muted">No more restaurants to load</p>
        </div>
      )}
    </div>
  );
};

export default Home;
