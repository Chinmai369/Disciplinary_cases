-- ============================================================================
-- Disciplinary Cases Management System - SQL Queries
-- ============================================================================
-- This file contains all SQL queries for the normalized database structure
-- Use these queries as reference or directly in your repository layer
-- ============================================================================

-- ============================================================================
-- SELECT QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Get All Cases (List View with Basic Info)
-- ----------------------------------------------------------------------------
SELECT 
    dc.id, 
    dc.case_type, 
    dc.created_at, 
    dc.updated_at,
    cbi.file_number, 
    cbi.e_office_number, 
    cbi.employee_id, 
    cbi.employee_name, 
    cbi.date_of_incident,
    cc.category_name as categoryOfCase,
    csc.sub_category_name as subCategoryOfCase,
    cs.status_name as status,
    s.severity_name as severity,
    d.designation_name as designationWhenChargesIssued,
    u.ulb_name as nameOfULB
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
LEFT JOIN severities s ON dc.severity_id = s.id
LEFT JOIN designations d ON cbi.designation_when_charges_issued_id = d.id
LEFT JOIN ulbs u ON cbi.ulb_id = u.id
ORDER BY dc.created_at DESC;

-- ----------------------------------------------------------------------------
-- Get Case by ID (Complete Case with All Sections)
-- ----------------------------------------------------------------------------
-- Main Case
SELECT 
    dc.*,
    cc.category_name, 
    cc.category_code,
    csc.sub_category_name, 
    csc.sub_category_code,
    cs.status_name, 
    cs.status_code,
    s.severity_name, 
    s.severity_code
FROM disciplinary_cases dc
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
LEFT JOIN severities s ON dc.severity_id = s.id
WHERE dc.id = ?;

-- Basic Info
SELECT 
    cbi.*,
    d.designation_name,
    u.ulb_name, 
    u.ulb_type
FROM case_basic_info cbi
LEFT JOIN designations d ON cbi.designation_when_charges_issued_id = d.id
LEFT JOIN ulbs u ON cbi.ulb_id = u.id
WHERE cbi.case_id = ?;

-- Trap Details
SELECT * FROM case_trap_details WHERE case_id = ?;

-- Prosecution and Charges
SELECT * FROM case_prosecution_charges WHERE case_id = ?;

-- WSD
SELECT * FROM case_wsd WHERE case_id = ?;

-- IO & PO Appointment
SELECT * FROM case_io_po_appointment WHERE case_id = ?;

-- Inquiry Report
SELECT * FROM case_inquiry_report WHERE case_id = ?;

-- WR
SELECT * FROM case_wr WHERE case_id = ?;

-- Remarks
SELECT * FROM case_remarks WHERE case_id = ?;

-- ----------------------------------------------------------------------------
-- Find Cases by Employee ID
-- ----------------------------------------------------------------------------
SELECT 
    dc.id, 
    dc.case_type, 
    dc.created_at,
    cbi.file_number, 
    cbi.employee_id, 
    cbi.employee_name, 
    cc.category_name as categoryOfCase,
    csc.sub_category_name as subCategoryOfCase,
    cs.status_name as status
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
WHERE cbi.employee_id = ?
ORDER BY dc.created_at DESC;

-- ----------------------------------------------------------------------------
-- Find Cases by Category
-- ----------------------------------------------------------------------------
SELECT 
    dc.id,
    cbi.file_number,
    cbi.employee_name,
    cs.status_name as status
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
WHERE cc.category_code = ?
ORDER BY dc.created_at DESC;

-- ----------------------------------------------------------------------------
-- Find Cases by Status
-- ----------------------------------------------------------------------------
SELECT 
    dc.id,
    cbi.file_number,
    cbi.employee_name,
    cc.category_name as categoryOfCase
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
WHERE cs.status_code = ?
ORDER BY dc.created_at DESC;

-- ============================================================================
-- INSERT QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Insert Main Case
-- ----------------------------------------------------------------------------
INSERT INTO disciplinary_cases 
    (id, case_category_id, case_sub_category_id, case_type, status_id, severity_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert Basic Information
-- ----------------------------------------------------------------------------
INSERT INTO case_basic_info 
    (case_id, file_number, e_office_number, employee_id, employee_name, 
     designation_when_charges_issued_id, ulb_id, date_of_incident)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert Trap Details
-- ----------------------------------------------------------------------------
INSERT INTO case_trap_details 
    (case_id, employee_suspended, suspended_by, suspension_proceeding_number, suspension_date,
     employee_reinitiated, reinstated_by, reinitiation_proceeding_number, reinitiation_date,
     suspension_period_regularize, regularised_by, regularization_proceeding_number, regularization_date,
     criminal_case_filed, criminal_case_number, criminal_case_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert Prosecution and Charges
-- ----------------------------------------------------------------------------
INSERT INTO case_prosecution_charges 
    (case_id, prosecution_sanctioned, prosecution_issued_by, prosecution_proceeding_number, prosecution_date,
     charges_issued, charge_memo_number_and_date, charges_memo_number, charges_date, 
     charges_issued_remarks, endorcement_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert WSD
-- ----------------------------------------------------------------------------
INSERT INTO case_wsd 
    (case_id, wsd_or_served_copy, wsd_checkbox, served_copy_checkbox, further_action_wsd,
     further_action_wsd_others, conclude_text, wsd_issued_by, wsd_number, wsd_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert IO & PO Appointment
-- ----------------------------------------------------------------------------
INSERT INTO case_io_po_appointment 
    (case_id, io_appointment, io_go_proceedings_number, io_appointment_date, 
     io_appointment_io_name, io_appointment_io_designation,
     po_appointment, po_go_proceedings_number, po_appointment_date,
     po_appointment_io_name, po_appointment_io_designation)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert Inquiry Report
-- ----------------------------------------------------------------------------
INSERT INTO case_inquiry_report 
    (case_id, inquiry_report_submitted, inquiry_report_number, inquiry_report_date, inquiry_report_name,
     further_action_inquiry, inquiry_agreed_endorsement_date,
     inquiry_disagreed_action, inquiry_remitted_number, inquiry_remitted_date,
     inquiry_appointment_proceeding_number, inquiry_appointment_io_name, inquiry_appointment_io_date,
     inquiry_communication_endorsement_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert WR
-- ----------------------------------------------------------------------------
INSERT INTO case_wr 
    (case_id, wr_or_served_copy, wr_checkbox, wr_served_copy_checkbox, further_action_wr,
     further_action_wr_remarks, wr_issued_by, punishment_number, punishment_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- ----------------------------------------------------------------------------
-- Insert Remarks
-- ----------------------------------------------------------------------------
INSERT INTO case_remarks (case_id, remarks) VALUES (?, ?);

-- ============================================================================
-- UPDATE QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Update Main Case
-- ----------------------------------------------------------------------------
UPDATE disciplinary_cases 
SET case_category_id = COALESCE(?, case_category_id),
    case_sub_category_id = COALESCE(?, case_sub_category_id),
    case_type = COALESCE(?, case_type),
    status_id = COALESCE(?, status_id),
    severity_id = COALESCE(?, severity_id),
    updated_by = COALESCE(?, updated_by),
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- ----------------------------------------------------------------------------
-- Update Basic Information (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_basic_info 
    (case_id, file_number, e_office_number, employee_id, employee_name, 
     designation_when_charges_issued_id, ulb_id, date_of_incident)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    file_number = VALUES(file_number),
    e_office_number = VALUES(e_office_number),
    employee_id = VALUES(employee_id),
    employee_name = VALUES(employee_name),
    designation_when_charges_issued_id = VALUES(designation_when_charges_issued_id),
    ulb_id = VALUES(ulb_id),
    date_of_incident = VALUES(date_of_incident),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update Trap Details (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_trap_details 
    (case_id, employee_suspended, suspended_by, suspension_proceeding_number, suspension_date,
     employee_reinitiated, reinstated_by, reinitiation_proceeding_number, reinitiation_date,
     suspension_period_regularize, regularised_by, regularization_proceeding_number, regularization_date,
     criminal_case_filed, criminal_case_number, criminal_case_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    employee_suspended = VALUES(employee_suspended),
    suspended_by = VALUES(suspended_by),
    suspension_proceeding_number = VALUES(suspension_proceeding_number),
    suspension_date = VALUES(suspension_date),
    employee_reinitiated = VALUES(employee_reinitiated),
    reinstated_by = VALUES(reinstated_by),
    reinitiation_proceeding_number = VALUES(reinitiation_proceeding_number),
    reinitiation_date = VALUES(reinitiation_date),
    suspension_period_regularize = VALUES(suspension_period_regularize),
    regularised_by = VALUES(regularised_by),
    regularization_proceeding_number = VALUES(regularization_proceeding_number),
    regularization_date = VALUES(regularization_date),
    criminal_case_filed = VALUES(criminal_case_filed),
    criminal_case_number = VALUES(criminal_case_number),
    criminal_case_date = VALUES(criminal_case_date),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update Prosecution and Charges (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_prosecution_charges 
    (case_id, prosecution_sanctioned, prosecution_issued_by, prosecution_proceeding_number, prosecution_date,
     charges_issued, charge_memo_number_and_date, charges_memo_number, charges_date, 
     charges_issued_remarks, endorcement_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    prosecution_sanctioned = VALUES(prosecution_sanctioned),
    prosecution_issued_by = VALUES(prosecution_issued_by),
    prosecution_proceeding_number = VALUES(prosecution_proceeding_number),
    prosecution_date = VALUES(prosecution_date),
    charges_issued = VALUES(charges_issued),
    charge_memo_number_and_date = VALUES(charge_memo_number_and_date),
    charges_memo_number = VALUES(charges_memo_number),
    charges_date = VALUES(charges_date),
    charges_issued_remarks = VALUES(charges_issued_remarks),
    endorcement_date = VALUES(endorcement_date),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update WSD (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_wsd 
    (case_id, wsd_or_served_copy, wsd_checkbox, served_copy_checkbox, further_action_wsd,
     further_action_wsd_others, conclude_text, wsd_issued_by, wsd_number, wsd_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    wsd_or_served_copy = VALUES(wsd_or_served_copy),
    wsd_checkbox = VALUES(wsd_checkbox),
    served_copy_checkbox = VALUES(served_copy_checkbox),
    further_action_wsd = VALUES(further_action_wsd),
    further_action_wsd_others = VALUES(further_action_wsd_others),
    conclude_text = VALUES(conclude_text),
    wsd_issued_by = VALUES(wsd_issued_by),
    wsd_number = VALUES(wsd_number),
    wsd_date = VALUES(wsd_date),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update IO & PO Appointment (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_io_po_appointment 
    (case_id, io_appointment, io_go_proceedings_number, io_appointment_date, 
     io_appointment_io_name, io_appointment_io_designation,
     po_appointment, po_go_proceedings_number, po_appointment_date,
     po_appointment_io_name, po_appointment_io_designation)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    io_appointment = VALUES(io_appointment),
    io_go_proceedings_number = VALUES(io_go_proceedings_number),
    io_appointment_date = VALUES(io_appointment_date),
    io_appointment_io_name = VALUES(io_appointment_io_name),
    io_appointment_io_designation = VALUES(io_appointment_io_designation),
    po_appointment = VALUES(po_appointment),
    po_go_proceedings_number = VALUES(po_go_proceedings_number),
    po_appointment_date = VALUES(po_appointment_date),
    po_appointment_io_name = VALUES(po_appointment_io_name),
    po_appointment_io_designation = VALUES(po_appointment_io_designation),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update Inquiry Report (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_inquiry_report 
    (case_id, inquiry_report_submitted, inquiry_report_number, inquiry_report_date, inquiry_report_name,
     further_action_inquiry, inquiry_agreed_endorsement_date,
     inquiry_disagreed_action, inquiry_remitted_number, inquiry_remitted_date,
     inquiry_appointment_proceeding_number, inquiry_appointment_io_name, inquiry_appointment_io_date,
     inquiry_communication_endorsement_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    inquiry_report_submitted = VALUES(inquiry_report_submitted),
    inquiry_report_number = VALUES(inquiry_report_number),
    inquiry_report_date = VALUES(inquiry_report_date),
    inquiry_report_name = VALUES(inquiry_report_name),
    further_action_inquiry = VALUES(further_action_inquiry),
    inquiry_agreed_endorsement_date = VALUES(inquiry_agreed_endorsement_date),
    inquiry_disagreed_action = VALUES(inquiry_disagreed_action),
    inquiry_remitted_number = VALUES(inquiry_remitted_number),
    inquiry_remitted_date = VALUES(inquiry_remitted_date),
    inquiry_appointment_proceeding_number = VALUES(inquiry_appointment_proceeding_number),
    inquiry_appointment_io_name = VALUES(inquiry_appointment_io_name),
    inquiry_appointment_io_date = VALUES(inquiry_appointment_io_date),
    inquiry_communication_endorsement_date = VALUES(inquiry_communication_endorsement_date),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update WR (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_wr 
    (case_id, wr_or_served_copy, wr_checkbox, wr_served_copy_checkbox, further_action_wr,
     further_action_wr_remarks, wr_issued_by, punishment_number, punishment_date)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    wr_or_served_copy = VALUES(wr_or_served_copy),
    wr_checkbox = VALUES(wr_checkbox),
    wr_served_copy_checkbox = VALUES(wr_served_copy_checkbox),
    further_action_wr = VALUES(further_action_wr),
    further_action_wr_remarks = VALUES(further_action_wr_remarks),
    wr_issued_by = VALUES(wr_issued_by),
    punishment_number = VALUES(punishment_number),
    punishment_date = VALUES(punishment_date),
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Update Remarks (Using INSERT ... ON DUPLICATE KEY UPDATE)
-- ----------------------------------------------------------------------------
INSERT INTO case_remarks (case_id, remarks) 
VALUES (?, ?)
ON DUPLICATE KEY UPDATE
    remarks = VALUES(remarks),
    updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- DELETE QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Delete Case (CASCADE will automatically delete all related records)
-- ----------------------------------------------------------------------------
DELETE FROM disciplinary_cases WHERE id = ?;

-- ============================================================================
-- MASTER DATA QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Get All Case Categories
-- ----------------------------------------------------------------------------
SELECT * FROM case_categories WHERE is_active = TRUE ORDER BY display_order;

-- ----------------------------------------------------------------------------
-- Get Sub Categories by Category ID
-- ----------------------------------------------------------------------------
SELECT * FROM case_sub_categories 
WHERE category_id = ? AND is_active = TRUE 
ORDER BY display_order;

-- ----------------------------------------------------------------------------
-- Get All Designations
-- ----------------------------------------------------------------------------
SELECT * FROM designations WHERE is_active = TRUE ORDER BY display_order;

-- ----------------------------------------------------------------------------
-- Get All ULBs
-- ----------------------------------------------------------------------------
SELECT * FROM ulbs WHERE is_active = TRUE ORDER BY display_order;

-- ----------------------------------------------------------------------------
-- Get All Case Statuses
-- ----------------------------------------------------------------------------
SELECT * FROM case_statuses WHERE is_active = TRUE ORDER BY display_order;

-- ----------------------------------------------------------------------------
-- Get All Severities
-- ----------------------------------------------------------------------------
SELECT * FROM severities WHERE is_active = TRUE ORDER BY display_order;

-- ============================================================================
-- STATISTICS QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Get Case Count by Category
-- ----------------------------------------------------------------------------
SELECT 
    cc.category_name,
    COUNT(dc.id) as case_count
FROM case_categories cc
LEFT JOIN disciplinary_cases dc ON cc.id = dc.case_category_id
WHERE cc.is_active = TRUE
GROUP BY cc.id, cc.category_name
ORDER BY case_count DESC;

-- ----------------------------------------------------------------------------
-- Get Case Count by Status
-- ----------------------------------------------------------------------------
SELECT 
    cs.status_name,
    COUNT(dc.id) as case_count
FROM case_statuses cs
LEFT JOIN disciplinary_cases dc ON cs.id = dc.status_id
WHERE cs.is_active = TRUE
GROUP BY cs.id, cs.status_name
ORDER BY case_count DESC;

-- ----------------------------------------------------------------------------
-- Get Case Count by Severity
-- ----------------------------------------------------------------------------
SELECT 
    s.severity_name,
    COUNT(dc.id) as case_count
FROM severities s
LEFT JOIN disciplinary_cases dc ON s.id = dc.severity_id
WHERE s.is_active = TRUE
GROUP BY s.id, s.severity_name
ORDER BY case_count DESC;

-- ----------------------------------------------------------------------------
-- Get Recent Cases (Last 10)
-- ----------------------------------------------------------------------------
SELECT 
    dc.id,
    cbi.file_number,
    cbi.employee_name,
    cc.category_name as category,
    cs.status_name as status,
    dc.created_at
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
ORDER BY dc.created_at DESC
LIMIT 10;

-- ============================================================================
-- SEARCH QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Search Cases by Employee Name
-- ----------------------------------------------------------------------------
SELECT 
    dc.id,
    cbi.file_number,
    cbi.employee_name,
    cbi.employee_id,
    cc.category_name as category,
    cs.status_name as status
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
WHERE cbi.employee_name LIKE CONCAT('%', ?, '%')
ORDER BY dc.created_at DESC;

-- ----------------------------------------------------------------------------
-- Search Cases by File Number
-- ----------------------------------------------------------------------------
SELECT 
    dc.id,
    cbi.file_number,
    cbi.employee_name,
    cc.category_name as category,
    cs.status_name as status
FROM disciplinary_cases dc
LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
LEFT JOIN case_statuses cs ON dc.status_id = cs.id
WHERE cbi.file_number LIKE CONCAT('%', ?, '%')
ORDER BY dc.created_at DESC;

-- ============================================================================
-- END OF SQL QUERIES
-- ============================================================================

