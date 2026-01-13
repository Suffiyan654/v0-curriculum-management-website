// =====================================================
// AUTHENTICATION ROUTES
// File: server/routes/auth.js
// Description: Handles user login, logout, and session management
// =====================================================

import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"

const router = express.Router()

// =====================================================
// POST /api/auth/login
// Description: Authenticate user with email and password
// =====================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Query database for user
    const connection = await pool.getConnection()
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])
    connection.release()

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = users[0]

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Create session
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    // Return success response
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error during login" })
  }
})

// =====================================================
// POST /api/auth/logout
// Description: Clear user session
// =====================================================
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" })
    }
    res.json({ success: true, message: "Logged out successfully" })
  })
})

// =====================================================
// GET /api/auth/session
// Description: Get current session user info
// =====================================================
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
    })
  } else {
    res.json({
      authenticated: false,
      user: null,
    })
  }
})

export default router
