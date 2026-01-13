// =====================================================
// CURRICULUM CRUD ROUTES
// File: server/routes/curriculum.js
// Description: Handles all curriculum operations (Create, Read, Update, Delete)
// =====================================================

import express from "express"
import pool from "../db.js"
import { isAuthenticated, isManager } from "../server.js"

const router = express.Router()

// =====================================================
// GET /api/curriculum
// Description: Fetch all curriculum data (accessible to all authenticated users)
// =====================================================
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    const [curriculum] = await connection.execute("SELECT * FROM curriculum ORDER BY class_name, subject")
    connection.release()

    res.json({
      success: true,
      data: curriculum,
      count: curriculum.length,
    })
  } catch (error) {
    console.error("Fetch curriculum error:", error)
    res.status(500).json({ error: "Error fetching curriculum" })
  }
})

// =====================================================
// GET /api/curriculum/:id
// Description: Fetch single curriculum by ID
// =====================================================
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params

    const connection = await pool.getConnection()
    const [curriculum] = await connection.execute("SELECT * FROM curriculum WHERE id = ?", [id])
    connection.release()

    if (curriculum.length === 0) {
      return res.status(404).json({ error: "Curriculum not found" })
    }

    res.json({
      success: true,
      data: curriculum[0],
    })
  } catch (error) {
    console.error("Fetch curriculum error:", error)
    res.status(500).json({ error: "Error fetching curriculum" })
  }
})

// =====================================================
// POST /api/curriculum
// Description: Create new curriculum (MANAGER ONLY)
// =====================================================
router.post("/", isManager, async (req, res) => {
  try {
    const { class_name, subject, topic, description } = req.body

    // Validate required fields
    if (!class_name || !subject || !topic) {
      return res.status(400).json({ error: "Class name, subject, and topic are required" })
    }

    const connection = await pool.getConnection()
    const [result] = await connection.execute(
      "INSERT INTO curriculum (class_name, subject, topic, description) VALUES (?, ?, ?, ?)",
      [class_name, subject, topic, description || ""],
    )
    connection.release()

    res.status(201).json({
      success: true,
      message: "Curriculum created successfully",
      id: result.insertId,
      data: {
        id: result.insertId,
        class_name,
        subject,
        topic,
        description,
      },
    })
  } catch (error) {
    console.error("Create curriculum error:", error)
    res.status(500).json({ error: "Error creating curriculum" })
  }
})

// =====================================================
// PUT /api/curriculum/:id
// Description: Update curriculum by ID (MANAGER ONLY)
// =====================================================
router.put("/:id", isManager, async (req, res) => {
  try {
    const { id } = req.params
    const { class_name, subject, topic, description } = req.body

    // Validate required fields
    if (!class_name || !subject || !topic) {
      return res.status(400).json({ error: "Class name, subject, and topic are required" })
    }

    const connection = await pool.getConnection()

    // Check if curriculum exists
    const [existing] = await connection.execute("SELECT * FROM curriculum WHERE id = ?", [id])

    if (existing.length === 0) {
      connection.release()
      return res.status(404).json({ error: "Curriculum not found" })
    }

    // Update curriculum
    await connection.execute(
      "UPDATE curriculum SET class_name = ?, subject = ?, topic = ?, description = ? WHERE id = ?",
      [class_name, subject, topic, description || "", id],
    )
    connection.release()

    res.json({
      success: true,
      message: "Curriculum updated successfully",
      data: {
        id,
        class_name,
        subject,
        topic,
        description,
      },
    })
  } catch (error) {
    console.error("Update curriculum error:", error)
    res.status(500).json({ error: "Error updating curriculum" })
  }
})

// =====================================================
// DELETE /api/curriculum/:id
// Description: Delete curriculum by ID (MANAGER ONLY)
// =====================================================
router.delete("/:id", isManager, async (req, res) => {
  try {
    const { id } = req.params

    const connection = await pool.getConnection()

    // Check if curriculum exists
    const [existing] = await connection.execute("SELECT * FROM curriculum WHERE id = ?", [id])

    if (existing.length === 0) {
      connection.release()
      return res.status(404).json({ error: "Curriculum not found" })
    }

    // Delete curriculum
    await connection.execute("DELETE FROM curriculum WHERE id = ?", [id])
    connection.release()

    res.json({
      success: true,
      message: "Curriculum deleted successfully",
    })
  } catch (error) {
    console.error("Delete curriculum error:", error)
    res.status(500).json({ error: "Error deleting curriculum" })
  }
})

export default router
