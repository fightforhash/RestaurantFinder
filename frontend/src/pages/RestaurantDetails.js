import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant(res.data);
    } catch (error) {
      console.error("Error fetching restaurant details", error);
    }
  };

  if (!restaurant) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h2>{restaurant.name}</h2>
      <p><strong>Location:</strong> {restaurant.location.coordinates.join(", ")}</p>
      <p><strong>Rating:</strong> {restaurant.rating} / 5</p>

      <h4>Menu</h4>
      <table className="table table-striped">
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
              <td>{item.dietaryRestrictions.join(", ")}</td>
              <td>{item.spiceLevel}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantDetails;
