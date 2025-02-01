const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order.js');

// Route to get active orders
router.get('/orders', ordersController.getActiveOrders);

// Route to mark an order as completed
router.post('/orders/:id/complete', ordersController.completeOrder);

module.exports = router;