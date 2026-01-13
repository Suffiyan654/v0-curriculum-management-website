-- =====================================================
-- OMOTEC SCHOOL CURRICULUM MANAGEMENT SYSTEM
-- MySQL Database Schema
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS omotec_curriculum;
USE omotec_curriculum;

-- =====================================================
-- TABLE: users
-- Description: Stores user credentials and roles
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('manager', 'employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: curriculum
-- Description: Stores curriculum data with class, subject, topic, and description
-- =====================================================
CREATE TABLE IF NOT EXISTS curriculum (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Insert Default Users
-- =====================================================
-- Manager credentials: Manager@123 / password@4321
-- Employee credentials: Employee@123 / password@1234
-- NOTE: Passwords should be hashed in production (bcrypt)
-- =====================================================

INSERT INTO users (email, password, role) VALUES
('Manager@123', '$2b$10$YourHashedPasswordHere1', 'manager'),
('Employee@123', '$2b$10$YourHashedPasswordHere2', 'employee');

-- =====================================================
-- Sample Curriculum Data (optional)
-- =====================================================
INSERT INTO curriculum (class_name, subject, topic, description) VALUES
('10th Grade', 'Mathematics', 'Algebra', 'Study of algebraic expressions, equations, and functions'),
('10th Grade', 'Science', 'Physics', 'Basic principles of motion, force, and energy'),
('9th Grade', 'English', 'Literature', 'Analysis of classic literary works and writing techniques');
