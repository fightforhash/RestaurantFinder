import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    name: "",
    latitude: "",
    longitude: "",
    rating: "",
  });

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant({
        name: res.data.name,
        latitude: res.data.location.coordinates[1],
        longitude: res.data.location.coordinates[0],
        rating: res.data.rating,
      });
    } catch (error) {
      console.error("Error fetching restaurant details", error);
    }
  };

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/restaurants/${id}`, {
        name: restaurant.name,
        location: { type: "Point", coordinates: [parseFloat(restaurant.longitude), parseFloat(restaurant.latitude)] },
        rating: parseFloat(restaurant.rating),
      });
      navigate("/restaurants");
    } catch (error) {
      console.error("Error updating restaurant", error);
    }
  };

  return (
    <div>
      <h2>Edit Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" name="name" value={restaurant.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Latitude</label>
          <input type="number" className="form-control" name="latitude" value={restaurant.latitude} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Longitude</label>
          <input type="number" className="form-control" name="longitude" value={restaurant.longitude} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Rating (0-5)</label>
          <input type="number" className="form-control" name="rating" value={restaurant.rating} min="0" max="5" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-warning">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRestaurant;
