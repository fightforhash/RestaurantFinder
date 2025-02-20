const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: 'text' },
  cuisine: { type: String, index: true },
  dietaryRestrictions: [{ type: String, enum: ['vegan', 'gluten-free'] }],
  spiceLevel: { type: Number, min: 0, max: 5 },
  price: { type: Number, min: 0 }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  rating: { type: Number, min: 0, max: 5 },
  menu: [menuItemSchema]
});

// Geospatial Index
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);