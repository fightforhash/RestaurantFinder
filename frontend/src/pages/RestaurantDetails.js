import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import StarRating from "../components/StarRating";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await axios.get(`https://f4c59nb7-5050.usw2.devtunnels.ms/api/restaurants/${id}`);
      setRestaurant(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant details", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Restaurant not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0" style={{ color: '#2E7D32' }}>{restaurant.name}</h2>
        <Link to="/restaurants" className="btn btn-outline-success">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Restaurants
        </Link>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-success mb-3">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Location
                </h5>
                <p className="mb-1">
                  <strong>City:</strong> {restaurant.location.city}
                </p>
                <p className="mb-1">
                  <strong>District:</strong> {restaurant.location.district}
                </p>
                <p className="mb-0">
                  <strong>Address:</strong> {restaurant.location.address}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-success mb-3">
                  <i className="fas fa-star me-2"></i>
                  Rating
                </h5>
                <div className="d-flex align-items-center">
                  <StarRating
                    rating={restaurant.rating}
                    readOnly={true}
                    size="lg"
                  />
                  <span className="ms-2 text-muted">
                    {restaurant.rating} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white py-3">
          <h4 className="mb-0">
            <i className="fas fa-utensils me-2"></i>
            Menu Items
          </h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>Dietary Restrictions</th>
                  <th>Spice Level</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {restaurant.menu.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.cuisine}</td>
                    <td>
                      {item.dietaryRestrictions.map((restriction, i) => (
                        <span key={i} className="badge bg-success bg-opacity-10 text-success me-1">
                          {restriction}
                        </span>
                      ))}
                    </td>
                    <td>
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-fire ${i < item.spiceLevel ? 'text-danger' : 'text-muted'}`}
                        ></i>
                      ))}
                    </td>
                    <td className="fw-bold text-success">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
