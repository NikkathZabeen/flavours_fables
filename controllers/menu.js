// controllers/orders.js
const connection = require('../db');
exports.getItems = async (req, res) => {
    try {
        const [items] = await connection.execute('SELECT * FROM items');
        res.render('listings/menu.ejs', { items });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Server Error');
    }
};


// module.exports.addToCart = async (req, res) => {
//     const { quantity } = req.body;
//     const itemId = req.params.itemId;

//     try {
//         // Fetch item details
//         const [itemRows] = await connection.execute(
//             SELECT item_id, price, title, image_url FROM items WHERE item_id = ?, 
//             [itemId]
//         );

//         if (itemRows.length > 0) {
//             const item = itemRows[0];
//             // Insert into order_items
//             await connection.execute(
//                 `INSERT INTO order_items (order_id, item_id, quantity, price)
//                 VALUES (?, ?, ?, ?)`,
//                 [req.session.order_id || null, itemId, quantity, item.price]
//             );
//             res.redirect('/cart'); // Redirect to cart
//         } else {
//             res.status(404).send('Item not found');
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while adding to cart.');
//     }
// };
// module.exports.addToCart = async (req, res) => {
//     const { quantity } = req.body;
//     const itemId = req.params.itemId;

//     // Validate quantity
//     if (!quantity || quantity <= 0) {
//         return res.status(400).send('Invalid quantity');
//     }

//     try {
//         const [itemRows] = await connection.execute(
//             SELECT item_id, price, title, image_url FROM items WHERE item_id = ?, 
//             [itemId]
//         );

//         if (itemRows.length > 0) {
//             const item = itemRows[0];

//             let orderId = req.session.order_id;
//             if (!orderId) {
//                 const [orderResult] = await connection.execute(
//                     INSERT INTO orders (user_id, total_amount) VALUES (?, ?),
//                     [req.session.user_id, 0]
//                 );
//                 orderId = orderResult.insertId;
//                 req.session.order_id = orderId;
//             }

//             await connection.execute(
//                 `INSERT INTO order_items (order_id, item_id, quantity, price)
//                 VALUES (?, ?, ?, ?)`,
//                 [orderId, itemId, quantity, item.price]
//             );

//             res.redirect('/cart');
//         } else {
//             res.status(404).send('Item not found');
//         }
//     } catch (err) {
//         console.error('Error adding to cart:', err.message);
//         res.status(500).send('An error occurred while adding to cart.');
//     }
// };
// In menu.js controller

module.exports.addToCart = async (req, res) => {
    const { quantity } = req.body;
    const itemId = req.params.itemId;

    // Validate quantity
    if (!quantity || quantity <= 0) {
        return res.status(400).send('Invalid quantity');
    }

    try {
        // Retrieve user ID from session
        const userId = req.session.user_id;

        // Check if user is logged in
        if (!userId) {
            // User is not logged in, redirect to the login page
            return res.redirect('/login/signup'); // Adjust this path based on your routing
        }

        // Check if the user has reserved a table
        const [reservationRows] = await connection.execute(
            `SELECT * FROM reservations WHERE user_id = ?`, 
            [userId]
        );

        // Check if there are no reservations
        if (reservationRows.length === 0) {
            // User has not reserved a table, redirect to the reservation page
            return res.redirect('/reserve'); // Adjust this path based on your routing
        }

        // Fetch item details
        const [itemRows] = await connection.execute(
            `SELECT item_id, price FROM items WHERE item_id = ?`, 
            [itemId]
        );

        // Check if the item exists
        if (itemRows.length > 0) {
            const item = itemRows[0];

            let orderId = req.session.order_id;
            if (!orderId) {
                // Create a new order if it doesn't exist
                const [orderResult] = await connection.execute(
                    `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
                    [userId, 0] // Ensure userId is defined here
                );
                orderId = orderResult.insertId;
                req.session.order_id = orderId;
            }

            // Check if the item already exists in the order_items
            const [existingItemRows] = await connection.execute(
                `SELECT order_item_id, quantity FROM order_items 
                 WHERE order_id = ? AND item_id = ?`, 
                [orderId, itemId]
            );

            if (existingItemRows.length > 0) {
                // Update the existing item quantity
                const currentQuantity = existingItemRows[0].quantity; // Ensure it's a number
                const newQuantity = currentQuantity + parseInt(quantity, 10); // Ensure addition is done with numbers

                await connection.execute(
                    `UPDATE order_items 
                     SET quantity = ? 
                     WHERE order_item_id = ?`, 
                    [newQuantity, existingItemRows[0].order_item_id]
                );
            } else {
                // If the item does not exist, insert it into the order_items
                await connection.execute(
                    `INSERT INTO order_items (order_id, item_id, quantity, price)
                     VALUES (?, ?, ?, ?)`,
                    [orderId, itemId, quantity, item.price] // Ensure item.price is defined
                );
            }

            // Redirect to the cart after adding the item
            res.redirect('/cart');
        } else {
            // Handle case when item is not found
            res.status(404).send('Item not found');
        }
    } catch (err) {
        console.error('Error adding to cart:', err.message);
        res.status(500).send('An error occurred while adding to cart.');
    }
};



module.exports.updateCart = async (req, res) => {
    const { quantity } = req.body;
    const orderItemId = req.params.orderItemId;

    try {
        await connection.execute(
            `UPDATE order_items SET quantity = ? WHERE order_item_id = ?`, 
            [quantity, orderItemId]
        );
        res.redirect('/cart'); // Redirect back to cart
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating the cart.');
    }
};

module.exports.viewCart = async (req, res) => {
    try {
        // If order has been placed, hide the cart
        if (!req.session.order_id) {
            return res.render('listings/cart.ejs', { cartItems: [], totalAmount: 0 });
        }

        // Otherwise, fetch cart items and calculate total amount
        const [cartItems] = await connection.execute(
            `SELECT oi.order_item_id, i.title, i.image_url, oi.quantity, oi.price
             FROM order_items oi
             JOIN items i ON oi.item_id = i.item_id
             WHERE oi.order_id = ?`,
            [req.session.order_id]
        );

        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        res.render('listings/cart.ejs', { cartItems, totalAmount });
    } catch (err) {
        console.error('Error fetching the cart:', err);
        res.status(500).send('An error occurred while fetching the cart.');
    }
};


// module.exports.viewCart = async (req, res) => {
//     try {
//         const [cartItems] = await connection.execute(
//             `SELECT oi.order_item_id, i.title, i.image_url, oi.quantity, oi.price
//             FROM order_items oi
//             JOIN items i ON oi.item_id = i.item_id
//             WHERE oi.order_id = ?`, 
//             [req.session.order_id]
//         );

//         const totalAmount = cartItems.reduce((total, item) => {
//             return total + (item.price * item.quantity);
//         }, 0);

//         res.render('listings/cart.ejs', { cartItems, totalAmount });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while fetching the cart.');
//     }
// };

module.exports.deleteFromCart = async (req, res) => {
    const orderItemId = req.params.orderItemId;

    try {
        await connection.execute(
            `DELETE FROM order_items WHERE order_item_id = ?`, 
            [orderItemId]
        );
        res.redirect('/cart'); // Redirect back to cart
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the item.');
    }
};

module.exports.placeOrder = async (req, res) => {
    const totalAmount = parseFloat(req.body.totalAmount); // Get total amount from the form

    // Generate a random employee ID between 1 and 10
    const employeeId = Math.floor(Math.random() * 10) + 1; 

    try {
        // Update the orders table with total amount and assigned employee ID
        await connection.execute(
            `UPDATE orders SET total_amount = ?, employee_id = ? WHERE user_id = ? AND total_amount = 0`,
            [totalAmount, employeeId, req.session.user_id]
        );

        // Fetch the cart items to display in the order confirmation
        const [cartItems] = await connection.execute(
            `SELECT i.title, oi.quantity
             FROM order_items oi
             JOIN items i ON oi.item_id = i.item_id
             WHERE oi.order_id = ?`,
            [req.session.order_id]
        );

        // Clear session data related to cart, but don't delete from the database
        req.session.order_id = null;  // Reset order_id after placing the order

        // Render order confirmation page
        res.render('listings/order-confirmation.ejs', { cartItems, totalAmount });
    } catch (err) {
        console.error('Error placing the order:', err);
        res.status(500).send('An error occurred while placing the order.');
    }
};

// module.exports.placeOrder = async (req, res) => {
//     const totalAmount = parseFloat(req.body.totalAmount); // Get total amount from the form

//     try {
//         // Insert into orders table
//         const [orderResult] = await connection.execute(
//             UPDATE orders SET total_amount = ? WHERE user_id = ? AND total_amount = 0,
//             [totalAmount, req.session.user_id]
//         );

//         // Fetch the cart items to show in the popup
//         const [cartItems] = await connection.execute(
//             `SELECT i.title, oi.quantity
//              FROM order_items oi
//              JOIN items i ON oi.item_id = i.item_id
//              WHERE oi.order_id = ?`,
//             [req.session.order_id]
//         );
//         req.session.cart = []; 
//         // Render the success page with order details
//         res.render('listings/order-confirmation.ejs', { cartItems, totalAmount });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while placing the order.');
//     }
// };

// Adjust according to your model's path

// Route to place order
// module.exports.successfulcart=async (req, res) => {
//     const { totalAmount } = req.body;
    
//     try {
//         // Your logic to process the order and clear the cart
      
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// };