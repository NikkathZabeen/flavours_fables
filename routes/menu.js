// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/menu.js'); // Import the controller

// // Fetch all items and display them
// router.get('/items', cartController.getItems);

// // Add item to the cart
// router.post('/cart/add/:id', cartController.addToCart);

// // View the cart
// router.get('/cart', cartController.viewCart);

// // Update item quantity in the cart
// router.post('/cart/update/:id', cartController.updateCart);

// // Delete item from the cart
// router.post('/cart/delete/:id', cartController.deleteFromCart);

// // Place an order
// router.post('/order/place', cartController.placeOrder);

// module.exports = router;

// Assuming your existing router file
const express = require('express');
const router = express.Router();
const listingsController = require("../controllers/listing.js");
const menuController = require("../controllers/menu.js"); // New orders controller

// Middleware to check if the user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.session.user_id) {
//         return next();
//     }
//     res.redirect('/login/signup');
// }

// Route to add items to cart
router.get('/items', menuController.getItems);

router.post('/cart/add/:itemId', menuController.addToCart);
router.get('/cart',  menuController.viewCart);
// Update item quantity in the cart
router.post('/cart/update/:orderItemId',  menuController.updateCart);

router.post('/cart/delete/:orderItemId', menuController.deleteFromCart);
router.post('/cart/place-order',  menuController.placeOrder);
module.exports = router;

