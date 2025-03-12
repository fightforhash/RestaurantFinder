import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import StarRating from "../components/StarRating";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("https://f4c59nb7-5050.usw2.devtunnels.ms/api/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  };

  const deleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`https://f4c59nb7-5050.usw2.devtunnels.ms/api/restaurants/${id}`);
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
    <div className="container py-4">
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-3" style={{ color: '#2E7D32' }}>Restaurant Management</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-search text-success"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by name, city, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0">Location</th>
                      <th className="border-0">Rating</th>
                      <th className="border-0 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.map((restaurant) => (
                      <tr key={restaurant._id}>
                        <td className="border-0">
                          <Link to={`/restaurants/${restaurant._id}`} className="text-decoration-none text-dark">
                            {restaurant.name}
                          </Link>
                        </td>
                        <td className="border-0">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-map-marker-alt text-success me-2"></i>
                            <span>
                              {restaurant.location.city}
                              {restaurant.location.district && `, ${restaurant.location.district}`}
                            </span>
                          </div>
                          <small className="text-muted">
                            <i className="fas fa-map text-success me-2"></i>
                            {restaurant.location.address}
                          </small>
                        </td>
                        <td className="border-0">
                          <StarRating
                            rating={restaurant.rating}
                            readOnly={true}
                            size="sm"
                            interactive={false}
                          />
                        </td>
                        <td className="border-0 text-end">
                          <Link 
                            to={`/edit/${restaurant._id}`} 
                            className="btn btn-light btn-sm me-2"
                            style={{ 
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              color: '#2E7D32'
                            }}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </Link>
                          <button 
                            className="btn btn-light btn-sm"
                            onClick={() => deleteRestaurant(restaurant._id)}
                            style={{ 
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              color: '#dc3545'
                            }}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
