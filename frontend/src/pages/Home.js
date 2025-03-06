import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [rating, setRating] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, cuisine, dietaryRestrictions, spiceLevel, rating, priceMin, priceMax]);

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

  return (
    <div className="container">
      <h2>Restaurant Search</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select className="form-control" onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Filter by Cuisine</option>
            <option value="Asian">Asian</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
          </select>
        </div>

        <div className="col-md-4">
          <select className="form-control" onChange={(e) => setDietaryRestrictions(e.target.value)}>
            <option value="">Filter by Dietary Restrictions</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>

        <div className="col-md-4">
          <select className="form-control" onChange={(e) => setSpiceLevel(e.target.value)}>
            <option value="">Filter by Spice Level</option>
            <option value="0">Mild</option>
            <option value="1">Medium</option>
            <option value="2">Spicy</option>
            <option value="3">Extra Spicy</option>
            <option value="4">Extreme</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Minimum Rating"
            min="0"
            max="5"
            step="0.1"
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            min="0"
            onChange={(e) => setPriceMin(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            min="0"
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
      </div>

      <h3>Search Results</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Cuisine</th>
            <th>Dietary Restrictions</th>
            <th>Spice Level</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant) => (
            <tr key={restaurant._id}>
              <td>
                <Link to={`/restaurants/${restaurant._id}`}>{restaurant.name}</Link>
              </td>
              <td>{`${restaurant.location.city}, ${restaurant.location.district}, ${restaurant.location.address}`}</td>
              <td>{restaurant.rating}</td>
              <td>{restaurant.menu.map((item) => item.cuisine).join(", ")}</td>
              <td>{restaurant.menu.map((item) => item.dietaryRestrictions.join(", ")).join(", ")}</td>
              <td>{restaurant.menu.map((item) => item.spiceLevel).join(", ")}</td>
              <td>{restaurant.menu.map((item) => `$${item.price}`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
