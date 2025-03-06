const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: 'text' },
  cuisine: { type: String, index: true },
  dietaryRestrictions: [{ type: String, enum: ['vegan', 'gluten-free'] }],
  spiceLevel: { type: Number, min: 0, max: 5 },
  price: { type: Number, min: 0 }
});

const locationSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String, required: true },
  district: { type: String }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: locationSchema,
  rating: { type: Number, min: 0, max: 5 },
  menu: [menuItemSchema]
});

// Text index for location search
restaurantSchema.index({ 
  'location.address': 'text',
  'location.city': 'text',
  'location.district': 'text'
});

module.exports = mongoose.model('Restaurant', restaurantSchema);