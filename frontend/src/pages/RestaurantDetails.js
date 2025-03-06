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
    <div>
      <h3>{restaurant.name}</h3>
      <p><strong>Location:</strong> {restaurant.location.coordinates.join(", ")}</p>
      <p><strong>Rating:</strong> {restaurant.rating}</p>
      <h4>Menu:</h4>
      <ul className="list-group">
        {restaurant.menu.map((item) => (
          <li key={item._id} className="list-group-item">
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantDetails;
