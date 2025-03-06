import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: {
      address: "",
      city: "",
      district: ""
    },
    rating: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setRestaurant(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setRestaurant(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/restaurants", {
        name: restaurant.name,
        location: {
          address: restaurant.location.address,
          city: restaurant.location.city,
          district: restaurant.location.district
        },
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
          <input 
            type="text" 
            className="form-control" 
            name="name" 
            value={restaurant.name}
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>City</label>
          <input 
            type="text" 
            className="form-control" 
            name="location.city" 
            value={restaurant.location.city}
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input 
            type="text" 
            className="form-control" 
            name="location.address" 
            value={restaurant.location.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>District</label>
          <input 
            type="text" 
            className="form-control" 
            name="location.district" 
            value={restaurant.location.district}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Rating (0-5)</label>
          <input 
            type="number" 
            className="form-control" 
            name="rating" 
            value={restaurant.rating}
            min="0" 
            max="5" 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-success">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;
