const express = require('express');
const { 
    getRestaurants, addRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant,
    addMenuItem, deleteMenuItem
} = require('../controllers/restController');

const router = express.Router();

router.get('/', getRestaurants);                 
router.post('/', addRestaurant);                 
router.get('/:id', getRestaurantById);           
router.put('/:id', updateRestaurant);             
router.delete('/:id', deleteRestaurant);          


router.post('/:id/menu', addMenuItem);           
router.delete('/:id/menu/:menuItemId', deleteMenuItem); 

module.exports = router;
