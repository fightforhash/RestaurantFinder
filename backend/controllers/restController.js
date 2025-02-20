const Restaurant = require('../models/Restaurant');

exports.searchRestaurants = async (req, res) => {
  const { meals, lng, lat, radius = 5000, minRating } = req.query;

  // Build base query
  const query = {
    rating: { $gte: Number(minRating) || 0 }
  };

  // Geospatial filter
  if (lng && lat) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    };
  }

  // Meal name filter
  if (meals) {
    query['menu.name'] = { $in: meals.split(',') };
  }

  try {
    const results = await Restaurant.find(query)
      .select('name location rating menu')
      .lean()
      .limit(50);

    // Filter menu items
    const filtered = results.map(restaurant => ({
      ...restaurant,
      menu: restaurant.menu.filter(item => 
        meals ? meals.includes(item.name) : true
      )
    }));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};