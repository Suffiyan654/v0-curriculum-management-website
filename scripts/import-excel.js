// =====================================================
// EXCEL DATA IMPORT SCRIPT
// File: scripts/import-excel.js
// Description: Imports curriculum data from Excel file
// NOTE: Download Excel first and place in /scripts folder
// =====================================================

import XLSX from "xlsx"
import pool from "../server/db.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =====================================================
// IMPORT EXCEL FILE
// =====================================================
async function importExcelData() {
  try {
    console.log("\n=".repeat(50))
    console.log("OMOTEC Curriculum Excel Import")
    console.log("=".repeat(50) + "\n")

    // Path to Excel file (place your downloaded file here)
    const excelPath = path.join(__dirname, "curriculum_data.xlsx")

    // Read Excel file
    console.log("Reading Excel file...")
    const workbook = XLSX.readFile(excelPath)
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet)
    console.log(`Found ${data.length} rows in Excel file\n`)

    if (data.length === 0) {
      console.log("No data found in Excel file")
      process.exit(0)
    }

    // Validate data structure
    console.log("Validating data structure...")
    const requiredColumns = ["class_name", "subject", "topic"]
    const firstRow = data[0]
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow))

    if (missingColumns.length > 0) {
      console.error(`Missing required columns: ${missingColumns.join(", ")}`)
      console.error("Required columns: class_name, subject, topic, description (optional)\n")
      process.exit(1)
    }

    // Insert data into database
    const connection = await pool.getConnection()
    console.log("Connecting to database...")

    let successCount = 0
    let errorCount = 0

    for (const row of data) {
      try {
        const { class_name, subject, topic, description } = row

        if (!class_name || !subject || !topic) {
          console.warn(`Skipping row: missing required data`)
          errorCount++
          continue
        }

        await connection.execute(
          "INSERT INTO curriculum (class_name, subject, topic, description) VALUES (?, ?, ?, ?)",
          [
            class_name.toString().trim(),
            subject.toString().trim(),
            topic.toString().trim(),
            description ? description.toString().trim() : "",
          ],
        )

        successCount++
        console.log(`Inserted: ${class_name} - ${subject} - ${topic}`)
      } catch (error) {
        errorCount++
        console.error(`Error inserting row:`, error.message)
      }
    }

    connection.release()

    // Summary
    console.log("\n" + "=".repeat(50))
    console.log("Import Summary")
    console.log("=".repeat(50))
    console.log(`Successfully imported: ${successCount} records`)
    console.log(`Failed: ${errorCount} records`)
    console.log("=".repeat(50) + "\n")

    process.exit(0)
  } catch (error) {
    console.error("Import error:", error)
    process.exit(1)
  }
}

// Run import
importExcelData()
