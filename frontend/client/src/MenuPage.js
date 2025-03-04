import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "./api";
import "./App.css";

function MenuPage() {
  const { category } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`/api/restaurants?category=${category}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, [category]);

  return (
    <div className="menu-page">
      <h2>{category} Options</h2>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            {restaurant.name}: {restaurant.address} {restaurant.hours}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuPage;
