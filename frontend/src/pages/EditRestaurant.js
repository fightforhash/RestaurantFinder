import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "../components/StarRating";

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: {
      address: "",
      city: "",
      district: ""
    },
    rating: "",
    menu: []
  });

  const [menuItem, setMenuItem] = useState({
    name: "",
    cuisine: "",
    dietaryRestrictions: "",
    spiceLevel: 0,
    price: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    location: {
      city: "",
      address: "",
      district: ""
    },
    rating: "",
    menuItem: {
      name: "",
      cuisine: "",
      dietaryRestrictions: "",
      spiceLevel: "",
      price: ""
    }
  });

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const validateRestaurant = () => {
    const newErrors = {
      name: "",
      location: {
        city: "",
        address: "",
        district: ""
      },
      rating: "",
      menuItem: {
        name: "",
        cuisine: "",
        dietaryRestrictions: "",
        spiceLevel: "",
        price: ""
      }
    };

    let isValid = true;

    // Validate restaurant name
    if (!restaurant.name.trim()) {
      newErrors.name = "Restaurant name is required";
      isValid = false;
    }

    // Validate location
    if (!restaurant.location.city.trim()) {
      newErrors.location.city = "City is required";
      isValid = false;
    }

    // Validate rating
    if (!restaurant.rating) {
      newErrors.rating = "Rating is required";
      isValid = false;
    } else if (restaurant.rating < 0 || restaurant.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
      isValid = false;
    }

    // Validate menu items
    if (restaurant.menu.length === 0) {
      newErrors.menuItem.name = "At least one menu item is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateMenuItem = () => {
    const newErrors = {
      name: "",
      cuisine: "",
      dietaryRestrictions: "",
      spiceLevel: "",
      price: ""
    };

    let isValid = true;

    if (!menuItem.name.trim()) {
      newErrors.name = "Item name is required";
      isValid = false;
    }

    if (!menuItem.cuisine.trim()) {
      newErrors.cuisine = "Cuisine is required";
      isValid = false;
    }

    if (!menuItem.price || menuItem.price <= 0) {
      newErrors.price = "Valid price is required";
      isValid = false;
    }

    if (menuItem.spiceLevel < 0 || menuItem.spiceLevel > 4) {
      newErrors.spiceLevel = "Spice level must be between 0 and 4";
      isValid = false;
    }

    setErrors(prev => ({ ...prev, menuItem: newErrors }));
    return isValid;
  };

  const fetchRestaurantDetails = async () => {
    try {
      const res = await axios.get(`https://f4c59nb7-5050.usw2.devtunnels.ms/api/restaurants/${id}`);
      setRestaurant({
        name: res.data.name,
        location: {
          address: res.data.location.address || "",
          city: res.data.location.city,
          district: res.data.location.district || ""
        },
        rating: res.data.rating,
        menu: res.data.menu || []
      });
    } catch (error) {
      console.error("Error fetching restaurant details", error);
    }
  };

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
      // Clear location error when user types
      setErrors(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: ""
        }
      }));
    } else if (name.startsWith('menuItem.')) {
      const menuField = name.split('.')[1];
      setMenuItem(prev => ({ ...prev, [menuField]: value }));
      // Clear menu item error when user types
      setErrors(prev => ({
        ...prev,
        menuItem: {
          ...prev.menuItem,
          [menuField]: ""
        }
      }));
    } else {
      setRestaurant(prev => ({ ...prev, [name]: value }));
      // Clear error when user types
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddMenuItem = () => {
    if (validateMenuItem()) {
      setRestaurant(prev => ({
        ...prev,
        menu: [...prev.menu, { 
          ...menuItem, 
          dietaryRestrictions: menuItem.dietaryRestrictions ? [menuItem.dietaryRestrictions] : [],
          spiceLevel: parseInt(menuItem.spiceLevel),
          price: parseFloat(menuItem.price)
        }]
      }));
      setMenuItem({
        name: "",
        cuisine: "",
        dietaryRestrictions: "",
        spiceLevel: 0,
        price: ""
      });
    }
  };

  const handleRemoveMenuItem = (index) => {
    setRestaurant(prev => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateRestaurant()) {
      try {
        await axios.patch(`http://localhost:5050/api/restaurants/${id}`, {
          name: restaurant.name,
          location: {
            address: restaurant.location.address,
            city: restaurant.location.city,
            district: restaurant.location.district
          },
          rating: parseFloat(restaurant.rating),
          menu: restaurant.menu.map(item => ({
            ...item,
            spiceLevel: parseInt(item.spiceLevel),
            price: parseFloat(item.price)
          }))
        });
        navigate("/restaurants");
      } catch (error) {
        console.error("Error updating restaurant", error);
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      }
    }
  };

  return (
    <div>
      <h2>Edit Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input 
            type="text" 
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            name="name" 
            value={restaurant.name} 
            onChange={handleChange} 
            required 
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label>City</label>
          <input 
            type="text" 
            className={`form-control ${errors.location.city ? 'is-invalid' : ''}`}
            name="location.city" 
            value={restaurant.location.city} 
            onChange={handleChange} 
            required 
          />
          {errors.location.city && <div className="invalid-feedback">{errors.location.city}</div>}
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input 
            type="text" 
            className={`form-control ${errors.location.address ? 'is-invalid' : ''}`}
            name="location.address" 
            value={restaurant.location.address} 
            onChange={handleChange}
          />
          {errors.location.address && <div className="invalid-feedback">{errors.location.address}</div>}
        </div>
        <div className="mb-3">
          <label>District</label>
          <input 
            type="text" 
            className={`form-control ${errors.location.district ? 'is-invalid' : ''}`}
            name="location.district" 
            value={restaurant.location.district} 
            onChange={handleChange}
          />
          {errors.location.district && <div className="invalid-feedback">{errors.location.district}</div>}
        </div>
        <div className="mb-3">
          <label>Rating</label>
          <div className="mt-2">
            <StarRating
              rating={restaurant.rating || 0}
              onRatingChange={(value) => setRestaurant(prev => ({ ...prev, rating: value }))}
              size="lg"
              interactive={true}
            />
          </div>
          {errors.rating && <div className="invalid-feedback d-block">{errors.rating}</div>}
        </div>

        <h4>Menu Items</h4>
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <input
              type="text"
              className={`form-control ${errors.menuItem.name ? 'is-invalid' : ''}`}
              placeholder="Item Name"
              name="menuItem.name"
              value={menuItem.name}
              onChange={handleChange}
            />
            {errors.menuItem.name && <div className="invalid-feedback">{errors.menuItem.name}</div>}
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className={`form-control ${errors.menuItem.cuisine ? 'is-invalid' : ''}`}
              placeholder="Cuisine"
              name="menuItem.cuisine"
              value={menuItem.cuisine}
              onChange={handleChange}
            />
            {errors.menuItem.cuisine && <div className="invalid-feedback">{errors.menuItem.cuisine}</div>}
          </div>
          <div className="col-md-3">
            <select
              className={`form-control ${errors.menuItem.dietaryRestrictions ? 'is-invalid' : ''}`}
              name="menuItem.dietaryRestrictions"
              value={menuItem.dietaryRestrictions}
              onChange={handleChange}
            >
              <option value="">Select Dietary Restrictions</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
            {errors.menuItem.dietaryRestrictions && <div className="invalid-feedback">{errors.menuItem.dietaryRestrictions}</div>}
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className={`form-control ${errors.menuItem.spiceLevel ? 'is-invalid' : ''}`}
              placeholder="Spice Level (0-4)"
              name="menuItem.spiceLevel"
              value={menuItem.spiceLevel}
              min="0"
              max="4"
              onChange={handleChange}
            />
            {errors.menuItem.spiceLevel && <div className="invalid-feedback">{errors.menuItem.spiceLevel}</div>}
          </div>
          <div className="col-md-1">
            <input
              type="number"
              className={`form-control ${errors.menuItem.price ? 'is-invalid' : ''}`}
              placeholder="Price"
              name="menuItem.price"
              value={menuItem.price}
              onChange={handleChange}
            />
            {errors.menuItem.price && <div className="invalid-feedback">{errors.menuItem.price}</div>}
          </div>
          <div className="col-md-12">
            <button type="button" className="btn btn-primary" onClick={handleAddMenuItem}>
              Add Menu Item
            </button>
          </div>
        </div>

        {restaurant.menu.length > 0 && (
          <div className="mb-3">
            <h5>Current Menu Items</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>Dietary Restrictions</th>
                  <th>Spice Level</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurant.menu.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.cuisine}</td>
                    <td>{item.dietaryRestrictions.join(", ")}</td>
                    <td>{item.spiceLevel}</td>
                    <td>${item.price}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveMenuItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="submit" className="btn btn-warning">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRestaurant;
