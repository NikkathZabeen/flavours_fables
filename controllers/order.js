const db = require('../db'); // Assuming you have a database connection set up

// Fetch active orders
// exports.getActiveOrders = async (req, res) => {
//     try {
//         const [activeOrders] = await db.execute(`
//             SELECT o.order_id, u.username AS user_name, 
//                    GROUP_CONCAT(CONCAT(i.title, ' (', oi.quantity, ')') SEPARATOR ', ') AS items_ordered,
//                    ANY_VALUE(r.table_number) AS table_number, 
//                    ANY_VALUE(o.total_amount) AS total_amount
//             FROM orders o
//             JOIN users u ON o.user_id = u.user_id
//             JOIN order_items oi ON o.order_id = oi.order_id
//             JOIN items i ON oi.item_id = i.item_id
//             JOIN reservations r ON o.user_id = r.user_id
//             WHERE o.is_active = TRUE
//             GROUP BY o.order_id
//         `);
        
        
//         res.render('listings/orders', { orders: activeOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };

module.exports.getActiveOrders = async (req, res) => {
    try {
        // Assuming employee_id is stored in the session after employee logs in
        const employeeId = req.session.emp_id;

        if (!employeeId) {
            return res.status(403).send('Forbidden: Employee not logged in');
        }

        const [activeOrders] = await db.execute(`
            SELECT o.order_id, u.username AS user_name, 
                   GROUP_CONCAT(CONCAT(i.title, ' (', oi.quantity, ')') SEPARATOR ', ') AS items_ordered,
                   ANY_VALUE(r.table_number) AS table_number, 
                   ANY_VALUE(o.total_amount) AS total_amount
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN items i ON oi.item_id = i.item_id
            JOIN reservations r ON o.user_id = r.user_id
            WHERE o.is_active = TRUE
              AND o.employee_id = ?  -- Only show orders assigned to the logged-in employee
            GROUP BY o.order_id
        `, [employeeId]);  // Pass the employee ID as a parameter

        res.render('employee/orders', { orders: activeOrders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Mark order as completed
// exports.completeOrder = async (req, res) => {
//     const orderId = req.params.id;
//     try {
//         // Mark the order as inactive
//         await db.execute('UPDATE orders SET is_active = FALSE WHERE order_id = ?', [orderId]);

//         // Remove the table number from reservations table
//         await db.execute('DELETE FROM reservations WHERE table_number = (SELECT table_number FROM orders WHERE order_id = ?)', [orderId]);

//         res.redirect('listings/orders');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };


exports.completeOrder = async (req, res) => {
    const orderId = req.params.id;
    const employeeId = req.session.emp_id;  // Get the logged-in employee's ID

    const connection = await db.getConnection();  // Use a connection object to control transactions

    try {
        await connection.beginTransaction();  // Start transaction

        // Fetch the table number from the reservations table
        const [rows] = await connection.execute(`
            SELECT r.table_number 
            FROM reservations r
            JOIN orders o ON r.user_id = o.user_id
            WHERE o.order_id = ?
              AND o.employee_id = ?  -- Ensure that only the logged-in employee's order is affected
        `, [orderId, employeeId]);

        const tableNumber = rows.length > 0 ? rows[0].table_number : null;

        if (tableNumber) {
            // Remove the specific table number from the reservations table
            await connection.execute('DELETE FROM reservations WHERE table_number = ?', [tableNumber]);
        }

        // Mark the specific order as inactive, only if it belongs to the logged-in employee
        await connection.execute('UPDATE orders SET is_active = FALSE WHERE order_id = ? AND employee_id = ?', [orderId, employeeId]);

        // Commit the transaction
        await connection.commit();

        // Fetch updated active orders for the logged-in employee
        const [activeOrders] = await db.execute(`
            SELECT o.order_id, u.username AS user_name, 
                   GROUP_CONCAT(CONCAT(i.title, ' (', oi.quantity, ')') SEPARATOR ', ') AS items_ordered,
                   ANY_VALUE(r.table_number) AS table_number, 
                   ANY_VALUE(o.total_amount) AS total_amount
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN items i ON oi.item_id = i.item_id
            JOIN reservations r ON o.user_id = r.user_id
            WHERE o.is_active = TRUE
              AND o.employee_id = ?  -- Ensure only this employee's orders are shown
            GROUP BY o.order_id
        `, [employeeId]);

        // Render the orders page with the updated list of active orders
        res.render('employee/orders', { orders: activeOrders });

    } catch (err) {
        await connection.rollback();  // Rollback if any error occurs
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
};




// module.exports.completeOrder = async (req, res) => {
//     const orderId = req.params.id;

//     // Start a transaction
//     const connection = await db.getConnection();  // Use a connection object to control transactions
    
//     try {
//         await connection.beginTransaction();  // Start transaction

//         // Fetch the table number from the reservations table, using the order_id
//         const [rows] = await connection.execute(`
//             SELECT r.table_number 
//             FROM reservations r
//             JOIN orders o ON r.user_id = o.user_id
//             WHERE o.order_id = ?
//         `, [orderId]);

//         const tableNumber = rows.length > 0 ? rows[0].table_number : null;

//         if (tableNumber) {
//             // Remove the specific table number from the reservations table
//             await connection.execute('DELETE FROM reservations WHERE table_number = ?', [tableNumber]);
//         }

//         // Mark the order as inactive
//         await connection.execute('UPDATE orders SET is_active = FALSE WHERE order_id = ?', [orderId]);

//         // Commit the transaction
//         await connection.commit();

//         res.render('listings/orders.ejs');
//     } catch (err) {
//         // Rollback in case of an error
//         await connection.rollback();
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         // Release the connection after processing
//         connection.release();
//     }
// };


// const db = require('../db'); // Assuming you have a database connection set up

// // Fetch active orders
// module.exports.getActiveOrders = async (req, res) => {
//     try {
//         const [activeOrders] = await db.execute(`
//             SELECT o.order_id, u.username AS user_name, 
//                    GROUP_CONCAT(CONCAT(i.title, ' (', oi.quantity, ')') SEPARATOR ', ') AS items_ordered,
//                    r.table_number, o.total_amount
//             FROM orders o
//             JOIN users u ON o.user_id = u.user_id
//             JOIN order_items oi ON o.order_id = oi.order_id
//             JOIN items i ON oi.item_id = i.item_id
//             JOIN reservations r ON o.user_id = r.user_id
//             WHERE o.is_active = TRUE
//             GROUP BY o.order_id, u.username, r.table_number, o.total_amount
//         `);
        
//         res.render('listings/orders', { orders: activeOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// // Mark order as completed
// module.exports.completeOrder = async (req, res) => {
//     const orderId = req.params.id;
//     try {
//         // Mark the order as inactive
//         await db.execute('UPDATE orders SET is_active = FALSE WHERE order_id = ?', [orderId]);

//         // Remove the table number from the reservations table
//         await db.execute('DELETE FROM reservations WHERE user_id = (SELECT user_id FROM orders WHERE order_id = ?) AND table_number = (SELECT table_number FROM reservations WHERE user_id = (SELECT user_id FROM orders WHERE order_id = ?))', [orderId, orderId]);

//         res.redirect('/orders'); // Redirect to the orders page after completion
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// };