import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  const deleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
      } catch (error) {
        console.error("Error deleting restaurant", error);
      }
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h2>Restaurant List</h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, city, or district..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td>
                  <Link to={`/restaurants/${restaurant._id}`}>{restaurant.name}</Link>
                </td>
                <td>
                  {restaurant.location.city}
                  {restaurant.location.district && `, ${restaurant.location.district}`}
                  {restaurant.location.address && ` - ${restaurant.location.address}`}
                </td>
                <td>{restaurant.rating}</td>
                <td>
                  <Link className="btn btn-warning btn-sm mx-2" to={`/edit/${restaurant._id}`}>
                    Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteRestaurant(restaurant._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-md-6">
        <Outlet />
      </div>
    </div>
  );
};

export default RestaurantList;
