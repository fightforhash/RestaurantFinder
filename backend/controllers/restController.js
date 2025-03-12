const Restaurant = require('../models/Restaurant');


exports.getRestaurants = async (req, res) => {
    try {
        const { city, district, address } = req.query;
        let query = {};

        // Add location filters if provided
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (district) query['location.district'] = new RegExp(district, 'i');
        if (address) query['location.address'] = new RegExp(address, 'i');

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addRestaurant = async (req, res) => {
    try {
        console.log('Received data:', JSON.stringify(req.body, null, 2)); // For debugging

        const { name, location, rating, menu } = req.body;

        // Check required fields
        if (!name || !location || !location.city) {
            console.log('Validation failed:', { name, location }); // For debugging
            return res.status(400).json({
                message: "Restaurant name and city are required"
            });
        }

        // Create a clean location object
        const locationData = {
            address: location.address || '',
            city: location.city,
            district: location.district || ''
        };

        const newRestaurant = new Restaurant({
            name,
            location: locationData,
            rating: rating || 0,
            menu: menu || []
        });

        console.log('New restaurant object:', JSON.stringify(newRestaurant, null, 2)); // For debugging
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        console.error('Error details:', error); // For debugging
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

