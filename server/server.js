// =====================================================
// MAIN SERVER FILE
// File: server/server.js
// Description: Express.js server configuration and routes
// =====================================================

import express from "express"
import session from "express-session"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Import route handlers
import authRoutes from "./routes/auth.js"
import curriculumRoutes from "./routes/curriculum.js"

dotenv.config()

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =====================================================
// MIDDLEWARE CONFIGURATION
// =====================================================

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "omotec_secret_key_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
)

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")))

// =====================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// =====================================================

// Middleware to check if user is authenticated
export function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({ error: "Not authenticated" })
  }
}

// Middleware to check if user is manager
export function isManager(req, res, next) {
  if (req.session.user && req.session.user.role === "manager") {
    next()
  } else {
    res.status(403).json({ error: "Access denied. Manager role required." })
  }
}

// =====================================================
// API ROUTES
// =====================================================

// Authentication routes
app.use("/api/auth", authRoutes)

// Curriculum routes
app.use("/api/curriculum", curriculumRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() })
})

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================

app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`\n${"=".repeat(50)}`)
  console.log("OMOTEC Curriculum Management System")
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`${"=".repeat(50)}\n`)
})
