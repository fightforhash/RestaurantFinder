const Restaurant = require('../models/Restaurant');


exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addRestaurant = async (req, res) => {
    const { name, location, rating, menu } = req.body;

    try {
        const newRestaurant = new Restaurant({
            name,
            location,
            rating,
            menu
        });

        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addMenuItem = async (req, res) => {
    try {
        const { name, cuisine, dietaryRestrictions, spiceLevel, price } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const newMenuItem = { name, cuisine, dietaryRestrictions, spiceLevel, price };
        restaurant.menu.push(newMenuItem);

        await restaurant.save();
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== menuItemId);
        
        await restaurant.save();
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
