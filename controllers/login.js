const db = require('../db'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');
const express = require('express');


module.exports.login=async(req, res) => {
    res.render('users/intermediate.ejs');
};
module.exports.renderuserlogin=async(req, res) => {
    res.render('users/userlogin.ejs');
};


module.exports.renderemployeelogin=async(req, res) => {
    res.render('employee/employeelogin.ejs');
};

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
    };

   
    
    // Signup route
    

    module.exports.signup = async (req, res) => {
        const { username, email, password } = req.body;
    
        // Basic validation
        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect('/login/signup'); // Redirect back to the signup page
        }
    
        try {
            // Get a connection from the pool
            const connection = await pool.getConnection();
    
            try {
                // Check if username or email already exists
                const [existingUser] = await connection.execute(
                    'SELECT * FROM users WHERE username = ? OR email = ?',
                    [username, email]
                );
    
                if (existingUser.length > 0) {
                    req.flash("error", "Username or email already registered!");
                    return res.redirect('/login/signup'); // Redirect to signup page
                }
    
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Generate a unique userId
                const userId = uuidv4();
    
                // Insert the user into the database
                await connection.execute(
                    'INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)',
                    [userId, username, email, hashedPassword]
                );
    
                req.flash("success", "Registration successful! Please log in.");
                return res.redirect('/login/user'); // Redirect to the login page
            } catch (dbError) {
                console.error('Database operation failed:', dbError);
                req.flash("error", "A database error occurred. Please try again.");
                return res.redirect('/login/signup');
            } finally {
                connection.release(); // Release the connection to the pool
            }
        } catch (error) {
            console.error('Error occurred during signup process:', error);
            req.flash("error", "An internal server error occurred. Please try again later.");
            return res.redirect('/login/signup');
        }
    };


// POST: Handle login

module.exports.userlogin = async (req, res) => {
    const { username, password } = req.body;

    // Log the incoming request body
    console.log('Login request received:', req.body);

    // Input validation
    if (!username || !password) {
        req.flash('error', 'Username and password are required');
        return res.redirect('/login/user'); // Redirect to the login page if input is missing
    }

    try {
        // Query the database for the user using connection.execute
        const [results] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        // Log the query results
        console.log('Query results:', results);

        // Check if user exists
        if (results.length === 0) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login/user'); // Redirect back to login if username does not exist
        }

        // Compare the password using bcrypt
        const user = results[0]; // The user object from the database
        const passwordMatch = await bcrypt.compare(password, user.password); // Compare entered password with stored hash

        if (!passwordMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login/user'); // Redirect back to login if password does not match
        }

        // Log the successful login
        console.log(`User ${user.username} logged in successfully`);

        // Set session (storing user_id)
        req.session.user_id = user.user_id; // Store user ID in session for later use
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                req.flash('error', 'Login failed due to session issues.');
                return res.redirect('/login/user');
            }

            // Flash success message
            req.flash('success', 'Login successful!');
            return res.redirect('/'); // Redirect to the home page after successful login
        });

    } catch (err) {
        console.error('Error during login process:', err);
        req.flash('error', 'Internal server error.');
        return res.status(500).json({ message: 'Internal server error.' }); // Handle unexpected errors
    }
};

module.exports.logout=async(req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        // Clear the cookie
        res.clearCookie('connect.sid'); // Assuming 'connect.sid' is the default session cookie name
        // req.flash('success', 'You have been logged out.');
        res.redirect('/login'); // Redirect to login page after logout
    });
};


module.exports.emplogin = async (req, res) => {
    const { email, password_emp } = req.body;

    // Check if both email and password are provided
    if (!email || !password_emp) {
        req.flash('error', 'Email and password are required.');
        return res.redirect('/login/employeelogin');
    }

    try {
        // Query the database to find the employee with the given email
        const [results] = await db.execute('SELECT * FROM employees WHERE emp_email = ?', [email]);

        if (results.length === 0) {
            // If no matching employee is found
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login/employeelogin');
        }

        const employee = results[0];

        // Check if the provided password matches the one in the database
        if (password_emp !== employee.passcode) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login/employeelogin');
        }

        // If login is successful, store employee ID in session
        req.session.emp_id = employee.emp_id;
        req.session.save((err) => {
            if (err) {
                req.flash('error', 'Login failed due to session issues.');
                return res.redirect('/login/employeelogin');
            }

            req.flash('success', 'Login successful!');
            res.redirect('/');  // Redirect to homepage or the intended page after successful login
        });

    } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Internal server error.');
        res.redirect('/login/employeelogin');
    }
};

module.exports.emplogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.redirect('/'); // Redirect to home on error
        }
        res.clearCookie('connect.sid'); // Clear the cookie
        res.redirect('/login'); // Redirect to home page
    });
};

