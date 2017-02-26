CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products3(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);


INSERT INTO products3 (product_name, department_name, price, stock_quantity)

VALUES ("Chocolate Chip Larabars", "Grocery", 14.79, 20), ("Saved by the Bell DVD Set", "Entertainment", 15.99, 10), ("Patagonia Jacket", "Outerwear", 120.00, 25), ("New Balance Shoes", "Shoes", 50.00, 5), ("Modern Romance by Aziz Ansari", "Books", 18.97, 32), ("Bossypanys by Tina Fey", "Books", 19.99, 12), ("Playing House DVD Set", "Entertainment", 10.98, 30), ("Sweet Potato Pop Chips", "Grocery", 35.34, 8), ("Adidas Women's Superstars", "Shoes", 65.00, 17), ("The Girl with the Lowerback Tattoo by Amy Schumer", "Books", 19.97, 10);
