-- Database Schema for Disciplinary Cases Management System
-- This schema will be used when connecting to a database

-- Disciplinary Cases Table
CREATE TABLE IF NOT EXISTS disciplinary_cases (
    id VARCHAR(255) PRIMARY KEY,
    employee_id VARCHAR(255) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    employee_email VARCHAR(255),
    department VARCHAR(255),
    position VARCHAR(255),
    incident_date DATE NOT NULL,
    reported_date DATETIME NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Pending', 'Under Review', 'Resolved', 'Closed') DEFAULT 'Pending',
    action_taken TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_id (employee_id),
    INDEX idx_status (status),
    INDEX idx_incident_date (incident_date)
);

-- Employees Table (for future use)
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(255) PRIMARY KEY,
    employee_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    hire_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department)
);

-- Case History Table (for tracking changes)
CREATE TABLE IF NOT EXISTS case_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL,
    changed_by VARCHAR(255),
    change_type VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id)
);

