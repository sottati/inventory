require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize PostgreSQL connection pool
const pool = new Pool({
  host:
    process.env.DB_HOST ||
    "inventory-database.ctkgskqss28a.us-east-1.rds.amazonaws.com",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // para testeo local
  },
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL database:", err.stack);
  } else {
    console.log("Successfully connected to PostgreSQL database");
    release();
  }
});

// Create tables and insert sample data
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if table is empty, then insert sample data
    const result = await pool.query("SELECT COUNT(*) FROM products");
    if (parseInt(result.rows[0].count) === 0) {
      const sampleProducts = [
        ["Laptop Pro", "Electronics", 15, 1299.99, "High-performance laptop"],
        [
          "Wireless Mouse",
          "Electronics",
          45,
          29.99,
          "Ergonomic wireless mouse",
        ],
        ["Office Chair", "Furniture", 8, 199.99, "Comfortable office chair"],
        ["Coffee Beans", "Food", 120, 12.99, "Premium coffee beans"],
        ["Notebook Set", "Office Supplies", 200, 8.99, "Pack of 3 notebooks"],
      ];

      for (const product of sampleProducts) {
        await pool.query(
          "INSERT INTO products (name, category, quantity, price, description) VALUES ($1, $2, $3, $4, $5)",
          product
        );
      }
      console.log("Sample data inserted successfully");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

initDatabase();

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, category, quantity, price, description } = req.body;

    if (!name || !category || quantity === undefined || price === undefined) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const result = await pool.query(
      "INSERT INTO products (name, category, quantity, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, category, quantity, price, description]
    );

    res.json({
      id: result.rows[0].id,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price, description } = req.body;

    const result = await pool.query(
      "UPDATE products SET name = $1, category = $2, quantity = $3, price = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6",
      [name, category, quantity, price, description, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_products,
        SUM(quantity) as total_items,
        COUNT(DISTINCT category) as categories,
        SUM(quantity * price) as total_value
      FROM products
    `);

    // Convert PostgreSQL numeric types to JavaScript numbers
    const stats = result.rows[0];
    res.json({
      total_products: parseInt(stats.total_products) || 0,
      total_items: parseInt(stats.total_items) || 0,
      categories: parseInt(stats.categories) || 0,
      total_value: parseFloat(stats.total_value) || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
