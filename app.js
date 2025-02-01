const mysql = require('mysql2');

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');



// Import the pool from db.js
const db = require('./db'); 

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'NiksSQL@5353',
//     database: 'projectdb'
// });

// Import routers
const loginRouter = require("./routes/login.js");
const menuRouter = require("./routes/menu.js");
const listingsRouter = require("./routes/listing.js");
const orderRouter = require("./routes/order.js")
// const cartRoutes = require('./routes/cart.js');



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', engine);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(session({
//     secret: 'dbmsproject', // Replace with a strong, unique key
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set `secure: true` if you're using HTTPS
// }));

app.use(session({
    secret: 'dbmsproject',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(flash());

app.use((req, res, next) => {
    res.locals.Success = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
});


// Example async function to test the DB connection
async function main() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connection successful:', rows[0].solution); // Should print 2
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}

main()
    .then(() => {
        console.log("DB connection test successful.");
    })
    .catch(err => {
        console.log("DB connection test failed:", err);
    });
    app.use((req, res, next) => {
        // Set a variable in res.locals if the user is logged in
        res.locals.user_id = req.session.user_id ; // Set user_id to null if no session exists
        res.locals.isLoggedIn = !!req.session.user_id; // Boolean to check if logged in
        // console.log('res.locals:', res.locals.user_id);  // Log res.locals to confirm
        res.locals.emp_id = req.session.emp_id;
        res.locals.isempLoggedIn = !!req.session.emp_id;
        // console.log('res.locals:',  res.locals.isempLoggedIn);
        next();
    });
    
// Use the listings router
app.use(menuRouter);
app.use("/login", loginRouter);
app.use(listingsRouter);
app.use(orderRouter);
// app.use('/cart', cartRoutes);


// Middleware to make user_id available in all templates


app.get('/', (req, res) => {
    res.render('listings/home.ejs'); // This will render home.ejs
});


app.get('/test', (req, res) => {
    res.send(`Logged in: ${res.locals.user_id}`);
});

app.get('/test', (req, res) => {
    res.send(`Logged in: ${res.locals.emp_id}`);
});





app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
