const connection = require('../db');

// Render the reservation form
module.exports.reserveform = async (req, res) => {
    res.render('listings/tablereserve.ejs'); // Ensure 'tablereserve.ejs' exists
};

// Handle reservation form submission
module.exports.reserve = async (req, res) => {
    const { reservation_date, hours, phone_number, occasions, num_persons } = req.body;

    try {
        // Get all table numbers already booked for the same date and time slot
        const [rows] = await connection.execute(
            `SELECT table_number FROM reservations WHERE reservation_date = ? AND reservation_hour = ?`,
            [reservation_date, hours]
        );

        // Get an array of available table numbers from 1 to 10
        const bookedTables = rows.map(row => row.table_number);
        const availableTables = Array.from({ length: 10 }, (_, i) => i + 1).filter(table => !bookedTables.includes(table));

        if (availableTables.length === 0) {
            return res.status(400).send('No tables available for the selected date and time.');
        }

        // Randomly pick an available table number
        const randomTableIndex = Math.floor(Math.random() * availableTables.length);
        const tableNumber = availableTables[randomTableIndex];

        // Insert the reservation with the randomly assigned table number
        const [result] = await connection.execute(
            `INSERT INTO reservations (user_id, reservation_date, reservation_hour, phone_number, occasion, num_persons, table_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.session.user_id, reservation_date, hours, phone_number, occasions, num_persons, tableNumber]
        );

        // Render the success page and pass the table number to the template
        res.render('listings/reservationsuccess', { tableNumber }); // Pass table number to the success page
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while processing your reservation.');
    }
};

module.exports.aboutus = async (req, res) => {
    res.render('listings/about.ejs'); 
};

module.exports.contact = async (req, res) => {
    res.render('listings/contact.ejs'); 
};

module.exports.feedback = async (req, res) => {
    const { name, email, message } = req.body;

    // Input validation (simple example)
    if (!name || !email || !message) {
        req.flash("error", "All fields are required.");
        return res.redirect('/'); // Redirect back to the contact form
    }

    try {
        // Insert the feedback into the database using connection.execute
        const query = 'INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)';
        await connection.execute(query, [name, email, message]);

        req.flash("success", "Feedback submitted successfully!");
        res.redirect('/'); // Redirect to the home page or contact page
    } catch (error) {
        console.error('Error saving feedback:', error);
        req.flash("error", "There was an error submitting your feedback. Please try again.");
        res.redirect('/'); // Redirect back to the contact form
    }
};
module.exports.showfeedbacks=async (req, res) => {
    try {
        // Query to select all feedback
        const [feedbacks] = await connection.execute('SELECT * FROM feedback ORDER BY created_at DESC');

        // Render feedback view with the fetched data
        res.render('listings/feedback.ejs', { feedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        req.flash("error", "There was an error retrieving feedbacks. Please try again.");
        res.redirect('/'); // Redirect to home page or an appropriate error page
    }
};