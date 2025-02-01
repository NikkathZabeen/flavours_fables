CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);
SELECT * FROM users;

CREATE TABLE items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10, 2)
);

INSERT INTO items (title, description, image_url, price) VALUES
('Margherita Pizza', 'A timeless Italian classic with fresh mozzarella, fragrant basil, and a crisp, golden crust that never disappoints.', 'https://i.pinimg.com/736x/c5/8e/66/c58e66b26a3e93c2da866363df13ee3a.jpg', 300),
('Chicken Burger', 'Tender, grilled chicken fillet served in a soft, toasted bun, packed with flavor and a touch of spice.','https://i.pinimg.com/enabled/564x/02/05/af/0205afec51d79660bf39cbd4b2bfe675.jpg', 250),
('Caesar Salad', 'Crisp romaine leaves tossed in creamy Caesar dressing, with savory croutons for the perfect crunch.','https://i.pinimg.com/564x/22/02/80/220280ef7a0e5ee7fc25dcde9969e27a.jpg', 200),
('Spaghetti Carbonara', 'Rich, creamy pasta with smoky bacon, parmesan, and a silky egg sauce that wraps every strand in indulgence.','https://i.pinimg.com/enabled/564x/b3/a9/31/b3a931f4d3ee8e12619d17d72d5ea389.jpg', 350),
('Sushi Platter', 'An elegant selection of fresh sushi rolls, crafted with precision and paired with savory soy sauce and wasabi.','https://i.pinimg.com/736x/d1/15/fd/d115fdbbcdaaf0f37ee5901abb321916.jpg',600),
('Grilled Salmon', 'Perfectly grilled salmon, seasoned with herbs and served with a squeeze of lemon for a fresh, zesty finish.','https://i.pinimg.com/enabled/564x/2f/8b/5d/2f8b5d0bf6e405594cc26a83dd3daaa4.jpg', 500),
('French Fries', 'Crispy, golden fries that are perfectly salted and served piping hot, a side thats impossible to resist.','https://i.pinimg.com/236x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg', 150),
('Chocolate Cake', 'A decadent slice of rich, moist chocolate cake with a velvety texture and a hint of sweetness.','https://i.pinimg.com/564x/b5/3c/a4/b53ca45d717c19cb3f6d5680e1ae1982.jpg', 180),
('Chicken Tacos', 'Zesty Mexican-style chicken tacos, wrapped in soft tortillas and loaded with fresh salsa and a kick of lime.','https://i.pinimg.com/enabled/236x/91/e9/55/91e95508006c2b6b9ec8af9667811245.jpg', 250),
('Greek Salad', 'A refreshing mix of crunchy cucumbers, ripe tomatoes, and briny feta, tossed in olive oil and lemon for a Mediterranean flair.','https://i.pinimg.com/enabled/236x/16/f9/85/16f9858fe1ade6fe992a0ab06dd345f7.jpg', 220),
('Vegetable Stir-Fry', 'Vibrant, stir-fried vegetables tossed in a savory soy glaze with a dash of ginger and garlic.','https://i.pinimg.com/564x/6d/4d/09/6d4d092801545d0d5a20a237084e1c71.jpg', 240),
('Beef Steak', 'Juicy, grilled beef steak, seasoned to perfection, with a caramelized crust and tender, flavorful center.','https://i.pinimg.com/564x/7a/4c/d3/7a4cd30d7e73bb271d0b083d3d361f9c.jpg', 450),
('Veggie Burger', 'A hearty, plant-based patty, grilled to perfection and served in a soft bun with fresh veggies and zesty sauce.','https://i.pinimg.com/564x/5a/ad/0f/5aad0f2c6414beb918e2aee10677491c.jpg', 270),
('Garlic Bread', 'Crunchy, golden garlic bread toasted with a buttery, garlicky spread and finished with a sprinkle of herbs.','https://i.pinimg.com/236x/b3/10/d1/b310d1883a313045e59325d0c5bffdee.jpg', 130),
('Cheese Nachos', 'Warm tortilla chips smothered in melted cheese and topped with jalapeños for a perfect shareable snack.', 'https://i.pinimg.com/236x/ab/19/18/ab19181a7671427faff8c527ddcc670a.jpg', 300),
('Pancakes', 'Fluffy, golden pancakes stacked high and drizzled with syrup, perfect for a sweet start to your day.', 'https://i.pinimg.com/enabled/236x/37/e3/22/37e322a5c45bbe8bde9e5c74e5a3b839.jpg', 200),
('Iced Coffee', 'Refreshing cold brew coffee served over ice, with a splash of cream for a smooth, energizing boost.', 'https://i.pinimg.com/enabled/236x/51/71/73/517173b28605b26b55c26dd6916c6e42.jpg', 180),
('Grilled Chicken', 'Succulent grilled chicken seasoned with a blend of herbs and spices, cooked to juicy perfection.', 'https://i.pinimg.com/enabled/236x/a3/a0/0b/a3a00b1d3ffba8b49746f26a6d7c64e2.jpg', 250),
('Fruit Salad', 'A vibrant medley of fresh, juicy fruits for a refreshing, guilt-free snack bursting with natural sweetness.', 'https://i.pinimg.com/236x/17/79/f3/1779f32d48e12e76279cd88ebeb3a6e4.jpg', 220),
('Lemonade', 'A zesty, refreshing lemonade with a perfect balance of tangy citrus and just the right touch of sweetness.', 'https://i.pinimg.com/enabled/236x/7d/c5/2a/7dc52a2e06d9c703cce83627dd8c9cc7.jpg', 150),
('BBQ Ribs', 'Slow-cooked, fall-off-the-bone BBQ ribs, coated in a smoky, sweet sauce that’ll have you licking your fingers.', 'https://i.pinimg.com/236x/87/5b/62/875b6248d41700d46171799c3ffcd7cf.jpg', 500),
('Veggie Pizza', 'A colorful mix of fresh veggies on a crispy pizza base, topped with a light layer of melted cheese.', 'https://i.pinimg.com/236x/37/b6/60/37b660cb40988dda83c8d345f62c83da.jpg', 350),
('Chicken Wrap', 'Grilled chicken wrapped in a soft tortilla with fresh veggies and a drizzle of tangy sauce.', 'https://i.pinimg.com/564x/c9/23/7c/c9237c65f9b5d5b0ae72e45fc1734024.jpg', 270),
('Milkshake', 'Thick, creamy milkshake blended to perfection and topped with whipped cream for a sweet treat.', 'https://i.pinimg.com/236x/fc/6b/f4/fc6bf459de03c231735463a7af243576.jpg', 200),
('Apple Pie', 'A warm, traditional apple pie with a flaky crust and cinnamon-spiced apples inside.', 'https://i.pinimg.com/564x/7c/60/25/7c6025512390c31ce4f3fd7ed035eff6.jpg', 180),
('Cappuccino', 'Hot, frothy cappuccino brewed to perfection, with a rich, creamy foam topping.', 'https://i.pinimg.com/enabled/236x/6a/86/c3/6a86c387495a30851e5843a582c7b6f2.jpg', 100),
('Vegetable Samosa', 'Crispy, golden samosas stuffed with seasoned vegetables for a deliciously spiced snack.', 'https://i.pinimg.com/236x/e7/ef/71/e7ef716d03838d2bd790e5cec416202c.jpg', 100),
('Fettuccine Alfredo', 'Creamy fettuccine Alfredo tossed in a rich, velvety sauce with a touch of parmesan.', 'https://i.pinimg.com/236x/77/22/58/77225875e41c00887bae925e369dc975.jpg', 350),
('Chicken Wings', 'Crispy, hot chicken wings served with a tangy, spicy sauce for the ultimate finger food.', 'https://i.pinimg.com/736x/ec/8a/ee/ec8aee3d078af75d59d2065bb774903b.jpg', 300),
('Brownie Sundae', 'A decadent brownie topped with vanilla ice cream and drizzled with rich fudge sauce for the perfect indulgence.', 'https://i.pinimg.com/474x/00/64/dd/0064dd8cf7e94cda0bf76712fc392166.jpg',220);

SELECT * FROM items;

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36),  -- For UUID
    total_amount DECIMAL(10, 2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);


SELECT * FROM orders;
SELECT * FROM order_items;



CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL, -- Foreign key to link with the user
    reservation_date DATE NOT NULL,
    reservation_hour TIME NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    num_persons INT NOT NULL CHECK (num_persons > 0 AND num_persons <= 8),
    FOREIGN KEY (user_id) REFERENCES users(user_id) -- Assuming a `users` table exists
);
ALTER TABLE reservations ADD table_number INT;

SELECT * FROM reservations;
TRUNCATE TABLE order_items;


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255)
);


CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_name VARCHAR(100) NOT NULL,
    emp_email VARCHAR(100) NOT NULL UNIQUE,
    passcode VARCHAR(255) NOT NULL
);
INSERT INTO employees (emp_name, emp_email, passcode)
 VALUES
('Aarav Sharma', 'aarav.sharma@example.com', 'Password123'),
('Vivaan Gupta', 'vivaan.gupta@example.com', 'Password456'),
('Aditya Patel', 'aditya.patel@example.com', 'Password789'),
('Vihaan Rao', 'vihaan.rao@example.com', 'Password321'),
('Reyansh Verma', 'reyansh.verma@example.com', 'Password654'),
('Ayaan Singh', 'ayaan.singh@example.com', 'Password987'),
('Dhruv Joshi', 'dhruv.joshi@example.com', 'Password159'),
('Krishna Nair', 'krishna.nair@example.com', 'Password753'),
('Kavya Iyer', 'kavya.iyer@example.com', 'Password852'),
('Anaya Mehta', 'anaya.mehta@example.com', 'Password963');

SELECT * FROM employees;

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM feedback;

ALTER TABLE orders ADD COLUMN employee_id INT;

ALTER TABLE orders ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

SELECT * FROM reservations;
SELECT * FROM orders;

TRUNCATE table feedback;
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM employees;
SELECT * FROM feedback;
SELECT * FROM reservations;
SELECT * FROM items;



