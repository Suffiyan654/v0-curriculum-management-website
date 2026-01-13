// =====================================================
// DATABASE CONNECTION CONFIGURATION
// File: server/db.js
// Description: Sets up MySQL connection pool
// =====================================================

import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "omotec_curriculum",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
})

// Test connection on startup
pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL Database Connected Successfully!")
    connection.release()
  })
  .catch((err) => {
    console.error("Database connection error:", err)
    process.exit(1)
  })

export default pool
