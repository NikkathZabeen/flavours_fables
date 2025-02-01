const express=require('express');
const router=express.Router();
const db = require('../app');
const listingsController=require("../controllers/listing.js");

router.get('/about',listingsController.aboutus);
router.get('/contact',listingsController.contact);
router.post('/feedback',listingsController.feedback);


// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.user_id) { // Check if session has a logged-in user
        return next(); // User is logged in, proceed to the next handler
    }
    // User is not logged in, redirect to signup or login
    res.redirect('/login/signup'); 
}

router.get('/reserve', isLoggedIn,listingsController.reserveform);
router.post('/reserve', isLoggedIn, listingsController.reserve);

router.get("/showfeedback",listingsController.showfeedbacks);


module.exports = router;