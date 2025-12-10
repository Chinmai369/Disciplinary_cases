-- ============================================================================
-- Disciplinary Cases Management System - Normalized Database Schema
-- ============================================================================
-- This file contains all table definitions and seed data for the application
-- Tables are normalized with separate tables for each form section
-- ============================================================================

-- Disable foreign key checks temporarily for easier setup
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- PART 1: MASTER TABLES (Reference Data)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Case Categories Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_categories;
CREATE TABLE case_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_code (category_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Case Sub Categories Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_sub_categories;
CREATE TABLE case_sub_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    sub_category_code VARCHAR(50) NOT NULL,
    sub_category_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES case_categories(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_sub_category (category_id, sub_category_code),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Designations Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS designations;
CREATE TABLE designations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    designation_code VARCHAR(50) UNIQUE NOT NULL,
    designation_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_designation_code (designation_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. ULB (Urban Local Bodies) Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS ulbs;
CREATE TABLE ulbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ulb_code VARCHAR(50) UNIQUE NOT NULL,
    ulb_name VARCHAR(255) NOT NULL,
    ulb_type ENUM('RDMA', 'C&DMA', 'UDA', 'Municipal Corporation', 'Municipality', 'Rural') NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Andhra Pradesh',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ulb_code (ulb_code),
    INDEX idx_ulb_type (ulb_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Case Status Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_statuses;
CREATE TABLE case_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_code (status_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Severity Master
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS severities;
CREATE TABLE severities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    severity_code VARCHAR(50) UNIQUE NOT NULL,
    severity_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_severity_code (severity_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PART 2: CORE TABLES (Transactional Data)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7. Users Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Employees Table (Optional but recommended)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    designation_id INT,
    ulb_id INT,
    department VARCHAR(255),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE SET NULL,
    FOREIGN KEY (ulb_id) REFERENCES ulbs(id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_designation_id (designation_id),
    INDEX idx_ulb_id (ulb_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Disciplinary Cases Table (Main Core Table - Basic Info Only)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS disciplinary_cases;
CREATE TABLE disciplinary_cases (
    id VARCHAR(255) PRIMARY KEY,
    
    -- Case Classification
    case_category_id INT NOT NULL,
    case_sub_category_id INT NOT NULL,
    case_type VARCHAR(100),
    
    -- Status and Metadata
    status_id INT DEFAULT 1,
    severity_id INT,
    created_by INT,
    updated_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_category_id) REFERENCES case_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (case_sub_category_id) REFERENCES case_sub_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (status_id) REFERENCES case_statuses(id) ON DELETE RESTRICT,
    FOREIGN KEY (severity_id) REFERENCES severities(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_case_category_id (case_category_id),
    INDEX idx_case_sub_category_id (case_sub_category_id),
    INDEX idx_status_id (status_id),
    INDEX idx_created_at (created_at),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Case Basic Information Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_basic_info;
CREATE TABLE case_basic_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Basic Information Fields
    file_number VARCHAR(255),
    e_office_number VARCHAR(255),
    employee_id VARCHAR(100),
    employee_name VARCHAR(255) NOT NULL,
    designation_when_charges_issued_id INT,
    ulb_id INT,
    date_of_incident DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (designation_when_charges_issued_id) REFERENCES designations(id) ON DELETE SET NULL,
    FOREIGN KEY (ulb_id) REFERENCES ulbs(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_file_number (file_number),
    INDEX idx_e_office_number (e_office_number),
    INDEX idx_employee_id (employee_id),
    INDEX idx_employee_name (employee_name),
    INDEX idx_date_of_incident (date_of_incident)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Case Trap Details Table (Subcategory Details)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_trap_details;
CREATE TABLE case_trap_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Suspension Details
    employee_suspended ENUM('yes', 'no', '') DEFAULT '',
    suspended_by VARCHAR(255),
    suspension_proceeding_number VARCHAR(255),
    suspension_date DATE,
    
    -- Reinitiation Details
    employee_reinitiated ENUM('yes', 'no', '') DEFAULT '',
    reinstated_by VARCHAR(255),
    reinitiation_proceeding_number VARCHAR(255),
    reinitiation_date DATE,
    
    -- Regularization Details
    suspension_period_regularize ENUM('yes', 'no', '') DEFAULT '',
    regularised_by VARCHAR(255),
    regularization_proceeding_number VARCHAR(255),
    regularization_date DATE,
    
    -- Criminal Case Details
    criminal_case_filed ENUM('yes', 'no', '') DEFAULT '',
    criminal_case_number VARCHAR(255),
    criminal_case_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_employee_suspended (employee_suspended),
    INDEX idx_criminal_case_filed (criminal_case_filed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. Case Prosecution and Charges Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_prosecution_charges;
CREATE TABLE case_prosecution_charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Prosecution Details
    prosecution_sanctioned ENUM('yes', 'no', '') DEFAULT '',
    prosecution_issued_by VARCHAR(255),
    prosecution_proceeding_number VARCHAR(255),
    prosecution_date DATE,
    
    -- Charges Details
    charges_issued ENUM('yes', 'no', '') DEFAULT '',
    charge_memo_number_and_date VARCHAR(255),
    charges_memo_number VARCHAR(255),
    charges_date DATE,
    charges_issued_remarks TEXT,
    endorcement_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_prosecution_sanctioned (prosecution_sanctioned),
    INDEX idx_charges_issued (charges_issued)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. Case WSD (Written Statement of Defence) Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_wsd;
CREATE TABLE case_wsd (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- WSD Basic Info
    wsd_or_served_copy ENUM('yes', 'no', '') DEFAULT '',
    wsd_checkbox BOOLEAN DEFAULT FALSE,
    served_copy_checkbox BOOLEAN DEFAULT FALSE,
    
    -- Further Action
    further_action_wsd ENUM('conclude', 'ioPoAppointment', 'others', '') DEFAULT '',
    further_action_wsd_others TEXT,
    
    -- Conclude Details
    conclude_text TEXT,
    wsd_issued_by VARCHAR(255),
    wsd_number VARCHAR(255),
    wsd_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_wsd_or_served_copy (wsd_or_served_copy),
    INDEX idx_further_action_wsd (further_action_wsd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. Case IO & PO Appointment Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_io_po_appointment;
CREATE TABLE case_io_po_appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- IO Appointment
    io_appointment ENUM('yes', 'no', '') DEFAULT '',
    io_go_proceedings_number VARCHAR(255),
    io_appointment_date DATE,
    io_appointment_io_name VARCHAR(255),
    io_appointment_io_designation VARCHAR(255),
    
    -- PO Appointment
    po_appointment ENUM('yes', 'no', '') DEFAULT '',
    po_go_proceedings_number VARCHAR(255),
    po_appointment_date DATE,
    po_appointment_io_name VARCHAR(255),
    po_appointment_io_designation VARCHAR(255),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_io_appointment (io_appointment),
    INDEX idx_po_appointment (po_appointment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. Case Inquiry Report Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_inquiry_report;
CREATE TABLE case_inquiry_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Inquiry Report Basic Info
    inquiry_report_submitted ENUM('yes', 'no', '') DEFAULT '',
    inquiry_report_number VARCHAR(255),
    inquiry_report_date DATE,
    inquiry_report_name VARCHAR(255),
    
    -- Further Action
    further_action_inquiry ENUM('agreed', 'disagreed', '') DEFAULT '',
    
    -- Agreed Action
    inquiry_agreed_endorsement_date DATE,
    
    -- Disagreed Action
    inquiry_disagreed_action ENUM('remitted', 'appointment', 'communication', '') DEFAULT '',
    
    -- Remitted Details
    inquiry_remitted_number VARCHAR(255),
    inquiry_remitted_date DATE,
    
    -- Appointment Details
    inquiry_appointment_proceeding_number VARCHAR(255),
    inquiry_appointment_io_name VARCHAR(255),
    inquiry_appointment_io_date DATE,
    
    -- Communication Details
    inquiry_communication_endorsement_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_inquiry_report_submitted (inquiry_report_submitted),
    INDEX idx_further_action_inquiry (further_action_inquiry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 16. Case WR (Written Representation) Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_wr;
CREATE TABLE case_wr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- WR Basic Info
    wr_or_served_copy ENUM('yes', 'no', '') DEFAULT '',
    wr_checkbox BOOLEAN DEFAULT FALSE,
    wr_served_copy_checkbox BOOLEAN DEFAULT FALSE,
    
    -- Further Action
    further_action_wr ENUM('punishment', 'dropped', 'warn', 'others', '') DEFAULT '',
    further_action_wr_remarks TEXT,
    
    -- Action Details
    wr_issued_by VARCHAR(255),
    punishment_number VARCHAR(255),
    punishment_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_wr_or_served_copy (wr_or_served_copy),
    INDEX idx_further_action_wr (further_action_wr)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 17. Case Remarks Table
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_remarks;
CREATE TABLE case_remarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Remarks
    remarks TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PART 3: SUPPORTING TABLES (Audit and Relationships)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 18. Case History / Audit Trail
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_history;
CREATE TABLE case_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL,
    changed_by INT,
    change_type ENUM('created', 'updated', 'status_changed', 'deleted') NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_case_id (case_id),
    INDEX idx_changed_by (changed_by),
    INDEX idx_change_type (change_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 19. Case Attachments (for future file uploads)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_attachments;
CREATE TABLE case_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    uploaded_by INT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_case_id (case_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 20. Case Comments / Notes
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS case_comments;
CREATE TABLE case_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    commented_by INT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES disciplinary_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (commented_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_case_id (case_id),
    INDEX idx_commented_by (commented_by),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- PART 4: SEED DATA - MASTER TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Seed Case Categories
-- ----------------------------------------------------------------------------
INSERT INTO case_categories (category_code, category_name, description, display_order) VALUES
('DEPT', 'Department', 'Department disciplinary cases', 1),
('ACB', 'ACB', 'Anti-Corruption Bureau cases', 2),
('VIG', 'Vigilance and Enforcement', 'Vigilance and Enforcement cases', 3);

-- ----------------------------------------------------------------------------
-- Seed Case Sub Categories
-- ----------------------------------------------------------------------------
INSERT INTO case_sub_categories (category_id, sub_category_code, sub_category_name, description, display_order) VALUES
-- Department subcategories
(1, 'MISAPP', 'Misappropriation', 'Misappropriation cases under Department category', 1),
(1, 'PROC_VIOL', 'Procedural violations', 'Procedural violations under Department category', 2),
-- ACB subcategories
(2, 'TRAP', 'Trap Case', 'Trap cases under ACB category', 1),
(2, 'DISP_ASSETS', 'Disproportionate Assets', 'Disproportionate Assets cases under ACB category', 2),
(2, 'SURP_CHECK', 'Surprise Check', 'Surprise Check cases under ACB category', 3),
-- Vigilance subcategories
(3, 'VIG_REPORT', 'Vigilance report', 'Vigilance report cases', 1),
(3, 'ALERT_NOTE', 'Alert note', 'Alert note cases', 2),
(3, 'APPRAISAL', 'Appraisal note', 'Appraisal note cases', 3);

-- ----------------------------------------------------------------------------
-- Seed Designations
-- ----------------------------------------------------------------------------
INSERT INTO designations (designation_code, designation_name, display_order) VALUES
('JUN_CLERK', 'Junior Clerk', 1),
('SEN_CLERK', 'Senior Clerk', 2),
('SEC_OFF', 'Section Officer', 3),
('ASST_DIR', 'Assistant Director', 4),
('DEP_DIR', 'Deputy Director', 5),
('DIR', 'Director', 6);

-- ----------------------------------------------------------------------------
-- Seed ULBs (Urban Local Bodies) - All 123+ ULBs
-- ----------------------------------------------------------------------------
INSERT INTO ulbs (ulb_code, ulb_name, ulb_type, display_order) VALUES
-- RDMA Offices
('RDMA_RAJ', 'RDMA Rajahmundry', 'RDMA', 1),
('RDMA_VSKP', 'RDMA Vishakapatnam', 'RDMA', 2),
('RDMA_GNT', 'RDMA Guntur', 'RDMA', 3),
('RDMA_ATP', 'RDMA Ananthapuram', 'RDMA', 4),
-- C&DMA Office
('CDMA_OFF', 'C&DMA Office', 'C&DMA', 5),
-- Urban Development Authorities
('UDA_1', 'Urban Development Authority 1', 'UDA', 6),
('UDA_2', 'Urban Development Authority 2', 'UDA', 7),
('UDA_3', 'Urban Development Authority 3', 'UDA', 8),
('UDA_4', 'Urban Development Authority 4', 'UDA', 9),
('UDA_5', 'Urban Development Authority 5', 'UDA', 10),
-- Municipal Corporations
('VSKP_MC', 'Visakhapatnam Municipal Corporation', 'Municipal Corporation', 11),
('VZM_MC', 'Vizianagaram Municipal Corporation', 'Municipal Corporation', 12),
('SKL_MC', 'Srikakulam Municipal Corporation', 'Municipal Corporation', 13),
('RAJ_MC', 'Rajahmundry Municipal Corporation', 'Municipal Corporation', 14),
('KKD_MC', 'Kakinada Municipal Corporation', 'Municipal Corporation', 15),
('ELR_MC', 'Eluru Municipal Corporation', 'Municipal Corporation', 16),
('VJW_MC', 'Vijayawada Municipal Corporation', 'Municipal Corporation', 17),
('MCL_MC', 'Machilipatnam Municipal Corporation', 'Municipal Corporation', 18),
('GNT_MC', 'Guntur Municipal Corporation', 'Municipal Corporation', 19),
('ONL_MC', 'Ongole Municipal Corporation', 'Municipal Corporation', 20),
('NLR_MC', 'Nellore Municipal Corporation', 'Municipal Corporation', 21),
('TUP_MC', 'Tirupati Municipal Corporation', 'Municipal Corporation', 22),
('CHT_MC', 'Chittoor Municipal Corporation', 'Municipal Corporation', 23),
('ATP_MC', 'Anantapur Municipal Corporation', 'Municipal Corporation', 24),
('KRN_MC', 'Kurnool Municipal Corporation', 'Municipal Corporation', 25),
('KDP_MC', 'Kadapa Municipal Corporation', 'Municipal Corporation', 26),
('NDL_MC', 'Nandyal Municipal Corporation', 'Municipal Corporation', 27),
-- Municipalities
('AMD', 'Amadalavalasa', 'Municipality', 28),
('ICP', 'Ichchapuram', 'Municipality', 29),
('PLK', 'Palasa-Kasibugga', 'Municipality', 30),
('SMP', 'Sompeta', 'Municipality', 31),
('BBL', 'Bobbili', 'Municipality', 32),
('PVM', 'Parvathipuram', 'Municipality', 33),
('SLR', 'Salur', 'Municipality', 34),
('CHP', 'Chipurupalli', 'Municipality', 35),
('AKP', 'Anakapalle', 'Municipality', 36),
('BMP', 'Bheemunipatnam', 'Municipality', 37),
('NSP', 'Narsipatnam', 'Municipality', 38),
('AMP', 'Amalapuram', 'Municipality', 39),
('RCP', 'Ramachandrapuram', 'Municipality', 40),
('GLP', 'Gollaprolu', 'Municipality', 41),
('BVM', 'Bhimavaram', 'Municipality', 42),
('TDG', 'Tadepalligudem', 'Municipality', 43),
('NSP2', 'Narasapuram', 'Municipality', 44),
('PLK2', 'Palakollu', 'Municipality', 45),
('GDV', 'Gudivada', 'Municipality', 46),
('PDN', 'Pedana', 'Municipality', 47),
('TRV', 'Tiruvuru', 'Municipality', 48),
('NZD', 'Nuzvid', 'Municipality', 49),
('NST', 'Narasaraopet', 'Municipality', 50),
('STN', 'Sattenapalli', 'Municipality', 51),
('PNR', 'Ponnur', 'Municipality', 52),
('RPL', 'Repalle', 'Municipality', 53),
('CHL', 'Chirala', 'Municipality', 54),
('MRK', 'Markapur', 'Municipality', 55),
('ADK', 'Addanki', 'Municipality', 56),
('GDR', 'Gudur', 'Municipality', 57),
('KVL', 'Kavali', 'Municipality', 58),
('SLP', 'Sullurpeta', 'Municipality', 59),
('MDP', 'Madanapalle', 'Municipality', 60),
('PGN', 'Punganur', 'Municipality', 61),
('NGR', 'Nagari', 'Municipality', 62),
('PLM', 'Palamaner', 'Municipality', 63),
('GTY', 'Gooty', 'Municipality', 64),
('TDP', 'Tadipatri', 'Municipality', 65),
('RYD', 'Rayadurg', 'Municipality', 66),
('URV', 'Uravakonda', 'Municipality', 67),
('ADN', 'Adoni', 'Municipality', 68),
('YMG', 'Yemmiganur', 'Municipality', 69),
('NDK', 'Nandikotkur', 'Municipality', 70),
('PRD', 'Proddatur', 'Municipality', 71),
('BDV', 'Badvel', 'Municipality', 72),
('MDK', 'Mydukur', 'Municipality', 73),
('KVT', 'Kaviti', 'Municipality', 74),
('HCP', 'Harishchandrapuram', 'Municipality', 75),
('KTV', 'Kothavalasa', 'Municipality', 76),
('GJP', 'Gajapathinagaram', 'Municipality', 77),
('CDR', 'Chodavaram', 'Municipality', 78),
('YLM', 'Yelamanchili', 'Municipality', 79),
('PDR', 'Paderu', 'Municipality', 80),
('MDP2', 'Mandapeta', 'Municipality', 81),
('SMK', 'Samalkot', 'Municipality', 82),
('KTP', 'Kotipalli', 'Municipality', 83),
('YLS', 'Yeleswaram', 'Municipality', 84),
('AKD', 'Akiveedu', 'Municipality', 85),
('ATL', 'Attili', 'Municipality', 86),
('PNG', 'Penugonda', 'Municipality', 87),
('KKP', 'Kankipadu', 'Municipality', 88),
('PRK', 'Poranki', 'Municipality', 89),
('MGL', 'Mangalagiri', 'Municipality', 90),
('TNL', 'Tenali Rural', 'Rural', 91),
('PDL', 'Podili', 'Municipality', 92),
('DRS', 'Darsi', 'Municipality', 93),
('NDP', 'Naidupeta', 'Municipality', 94),
('VNG', 'Venkatagiri', 'Municipality', 95),
('CDG', 'Chandragiri', 'Municipality', 96),
('SKH', 'Srikalahasti', 'Municipality', 97),
('KPM', 'Kuppam', 'Municipality', 98),
('KYD', 'Kalyandurg', 'Municipality', 99),
('BKP', 'Bukkapatnam', 'Municipality', 100),
('KYK', 'Koilakuntla', 'Municipality', 101),
('AGD', 'Allagadda', 'Municipality', 102),
('KMP', 'Kamalapuram', 'Municipality', 103),
('JMD', 'Jammalamadugu', 'Municipality', 104),
('TDW', 'Tadwai', 'Municipality', 105),
('PTN', 'Pathapatnam', 'Municipality', 106),
('MLP', 'Meliaputti', 'Municipality', 107),
('VGT', 'Veeraghattam', 'Municipality', 108),
('SBM', 'Santhabommali', 'Municipality', 109),
('DVP', 'Devarapalli', 'Municipality', 110),
('NTV', 'Nathavaram', 'Municipality', 111),
('KYR', 'Koyyuru', 'Municipality', 112),
('ETK', 'Etikoppaka', 'Municipality', 113),
('PRP', 'Prathipadu', 'Municipality', 114),
('PDP', 'Pedapudi', 'Municipality', 115),
('KVR', 'Kovvur Rural', 'Rural', 116),
('TLP', 'Tallapudi', 'Municipality', 117),
('VVS', 'Veeravasaram', 'Municipality', 118),
('MOV', 'Movva', 'Municipality', 119),
('KDR', 'Koduru', 'Municipality', 120),
('CLP', 'Chilakaluripet Rural', 'Rural', 121),
('INK', 'Inkollu', 'Municipality', 122),
('CJL', 'Chejerla', 'Municipality', 123),
('BRP', 'Buchireddypalem Rural', 'Rural', 124),
('RYC', 'Rayachoti', 'Municipality', 125),
('PLR', 'Pileru', 'Municipality', 126),
('PNK', 'Penukonda', 'Municipality', 127),
('HDP', 'Hindupur Rural', 'Rural', 128),
('DHN', 'Dhone', 'Municipality', 129),
('PNM', 'Panyam', 'Municipality', 130),
('PLP', 'Pullampeta', 'Municipality', 131),
('NDL2', 'Nandalur', 'Municipality', 132),
('TLP2', 'Tallaproddutur', 'Municipality', 133);

-- ----------------------------------------------------------------------------
-- Seed Case Statuses
-- ----------------------------------------------------------------------------
INSERT INTO case_statuses (status_code, status_name, description, display_order) VALUES
('PENDING', 'Pending', 'Case is pending review', 1),
('UNDER_REVIEW', 'Under Review', 'Case is currently under review', 2),
('RESOLVED', 'Resolved', 'Case has been resolved', 3),
('CLOSED', 'Closed', 'Case has been closed', 4);

-- ----------------------------------------------------------------------------
-- Seed Severities
-- ----------------------------------------------------------------------------
INSERT INTO severities (severity_code, severity_name, description, display_order) VALUES
('LOW', 'Low', 'Low severity case', 1),
('MEDIUM', 'Medium', 'Medium severity case', 2),
('HIGH', 'High', 'High severity case', 3),
('CRITICAL', 'Critical', 'Critical severity case', 4);

-- ----------------------------------------------------------------------------
-- Seed Default Users
-- ----------------------------------------------------------------------------
-- Note: In production, use bcrypt to hash passwords
-- Default password for admin: admin123
-- Default password for user: user123
-- These are placeholder hashes - replace with actual bcrypt hashes
INSERT INTO users (username, email, password_hash, role, full_name, is_active) VALUES
('admin', 'admin@example.com', '$2b$10$YourBcryptHashHere', 'admin', 'Administrator', TRUE),
('user', 'user@example.com', '$2b$10$YourBcryptHashHere', 'user', 'Regular User', TRUE);

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- 
-- Database Structure Summary:
-- ============================================================================
-- MASTER TABLES (6):
--   1. case_categories
--   2. case_sub_categories
--   3. designations
--   4. ulbs
--   5. case_statuses
--   6. severities
--
-- CORE TABLES (11):
--   7. users
--   8. employees
--   9. disciplinary_cases (Main table - minimal fields)
--   10. case_basic_info (Basic Information section)
--   11. case_trap_details (Trap Case/Subcategory Details section)
--   12. case_prosecution_charges (Prosecution and Charges section)
--   13. case_wsd (WSD section)
--   14. case_io_po_appointment (IO & PO Appointment section)
--   15. case_inquiry_report (Inquiry Report section)
--   16. case_wr (WR section)
--   17. case_remarks (Remarks section)
--
-- SUPPORTING TABLES (3):
--   18. case_history (Audit trail)
--   19. case_attachments (File uploads)
--   20. case_comments (Comments/Notes)
--
-- TOTAL: 20 TABLES
--
-- Notes:
-- 1. Each form section has its own table with one-to-one relationship to disciplinary_cases
-- 2. All related tables use CASCADE delete - when a case is deleted, all related data is deleted
-- 3. Replace password_hash values with actual bcrypt hashes in production
-- 4. All tables use UNIQUE constraint on case_id to ensure one-to-one relationship
-- 5. This normalized structure makes it easier to maintain and query specific sections
--
-- ============================================================================
