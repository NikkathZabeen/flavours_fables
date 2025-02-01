const express=require('express');
const router=express.Router();
const db = require('../app');
const loginController=require("../controllers/login.js");


router.get('/',loginController.login );

//user login
router.get("/signup",loginController.renderSignupForm);
router.get("/logout",loginController.logout)


router.post('/signup',loginController.signup);
router.get('/user', loginController.renderuserlogin);
router.post('/user',loginController.userlogin);

// Employee login 

router.get('/employeelogin',loginController.renderemployeelogin );

router.post('/employeelogin',loginController.emplogin);
router.get('/emplogout', loginController.emplogout); // Logout route


module.exports = router;