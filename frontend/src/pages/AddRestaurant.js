import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    latitude: "",
    longitude: "",
    rating: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/restaurants", {
        name: restaurant.name,
        location: { type: "Point", coordinates: [parseFloat(restaurant.longitude), parseFloat(restaurant.latitude)] },
        rating: parseFloat(restaurant.rating),
        menu: []
      });
      navigate("/restaurants");
    } catch (error) {
      console.error("Error adding restaurant", error);
    }
  };

  return (
    <div>
      <h2>Add New Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" name="name" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Latitude</label>
          <input type="number" className="form-control" name="latitude" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Longitude</label>
          <input type="number" className="form-control" name="longitude" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Rating (0-5)</label>
          <input type="number" className="form-control" name="rating" min="0" max="5" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
