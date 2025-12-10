const db = require('../database/db');

// Helper function to build complete case object from all related tables
const buildCompleteCase = async (caseId) => {
  // Get main case
  const cases = await db.query(
    `SELECT dc.*, 
            cc.category_name, cc.category_code,
            csc.sub_category_name, csc.sub_category_code,
            cs.status_name, cs.status_code,
            s.severity_name, s.severity_code
     FROM disciplinary_cases dc
     LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
     LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
     LEFT JOIN case_statuses cs ON dc.status_id = cs.id
     LEFT JOIN severities s ON dc.severity_id = s.id
     WHERE dc.id = ?`,
    [caseId]
  );

  if (cases.length === 0) {
    return null;
  }

  const mainCase = cases[0];

  // Get all related section data
  const basicInfo = await db.query(
    `SELECT cbi.*, 
            d.designation_name,
            u.ulb_name, u.ulb_type
     FROM case_basic_info cbi
     LEFT JOIN designations d ON cbi.designation_when_charges_issued_id = d.id
     LEFT JOIN ulbs u ON cbi.ulb_id = u.id
     WHERE cbi.case_id = ?`,
    [caseId]
  );

  const trapDetails = await db.query(
    'SELECT * FROM case_trap_details WHERE case_id = ?',
    [caseId]
  );

  const prosecutionCharges = await db.query(
    'SELECT * FROM case_prosecution_charges WHERE case_id = ?',
    [caseId]
  );

  const wsd = await db.query(
    'SELECT * FROM case_wsd WHERE case_id = ?',
    [caseId]
  );

  const ioPoAppointment = await db.query(
    'SELECT * FROM case_io_po_appointment WHERE case_id = ?',
    [caseId]
  );

  const inquiryReport = await db.query(
    'SELECT * FROM case_inquiry_report WHERE case_id = ?',
    [caseId]
  );

  const wr = await db.query(
    'SELECT * FROM case_wr WHERE case_id = ?',
    [caseId]
  );

  const remarks = await db.query(
    'SELECT * FROM case_remarks WHERE case_id = ?',
    [caseId]
  );

  // Combine all data into single object
  return {
    // Main case fields
    id: mainCase.id,
    caseCategoryId: mainCase.case_category_id,
    caseSubCategoryId: mainCase.case_sub_category_id,
    caseType: mainCase.case_type,
    statusId: mainCase.status_id,
    severityId: mainCase.severity_id,
    createdBy: mainCase.created_by,
    updatedBy: mainCase.updated_by,
    createdAt: mainCase.created_at,
    updatedAt: mainCase.updated_at,
    
    // Lookup values
    categoryOfCase: mainCase.category_name,
    categoryCode: mainCase.category_code,
    subCategoryOfCase: mainCase.sub_category_name,
    subCategoryCode: mainCase.sub_category_code,
    status: mainCase.status_name,
    statusCode: mainCase.status_code,
    severity: mainCase.severity_name,
    severityCode: mainCase.severity_code,
    
    // Basic Info
    ...(basicInfo[0] || {}),
    designationWhenChargesIssued: basicInfo[0]?.designation_name || null,
    nameOfULB: basicInfo[0]?.ulb_name || null,
    
    // Trap Details
    ...(trapDetails[0] || {}),
    
    // Prosecution and Charges
    ...(prosecutionCharges[0] || {}),
    
    // WSD
    ...(wsd[0] || {}),
    
    // IO & PO Appointment
    ...(ioPoAppointment[0] || {}),
    
    // Inquiry Report
    ...(inquiryReport[0] || {}),
    
    // WR
    ...(wr[0] || {}),
    
    // Remarks
    ...(remarks[0] || {})
  };
};

// Get all cases with basic info for listing
const findAll = async () => {
  const results = await db.query(
    `SELECT dc.id, dc.case_type, dc.created_at, dc.updated_at,
            cbi.file_number, cbi.e_office_number, cbi.employee_id, cbi.employee_name, 
            cbi.date_of_incident,
            cc.category_name as categoryOfCase,
            csc.sub_category_name as subCategoryOfCase,
            cs.status_name as status,
            d.designation_name as designationWhenChargesIssued,
            u.ulb_name as nameOfULB
     FROM disciplinary_cases dc
     LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
     LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
     LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
     LEFT JOIN case_statuses cs ON dc.status_id = cs.id
     LEFT JOIN designations d ON cbi.designation_when_charges_issued_id = d.id
     LEFT JOIN ulbs u ON cbi.ulb_id = u.id
     ORDER BY dc.created_at DESC`
  );
  return results;
};

// Get case by ID with all related data
const findById = async (id) => {
  return await buildCompleteCase(id);
};

// Create new case with all sections
const create = async (caseData) => {
  const caseId = caseData.id || Date.now().toString();
  
  return await db.transaction(async (connection) => {
    // 1. Insert main case
    await connection.execute(
      `INSERT INTO disciplinary_cases 
       (id, case_category_id, case_sub_category_id, case_type, status_id, severity_id, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        caseId,
        caseData.caseCategoryId || caseData.case_category_id,
        caseData.caseSubCategoryId || caseData.case_sub_category_id,
        caseData.caseType || caseData.case_type,
        caseData.statusId || caseData.status_id || 1,
        caseData.severityId || caseData.severity_id,
        caseData.createdBy || caseData.created_by,
        caseData.updatedBy || caseData.updated_by
      ]
    );

    // 2. Insert basic info
    if (caseData.fileNumber || caseData.employeeName || caseData.name) {
      await connection.execute(
        `INSERT INTO case_basic_info 
         (case_id, file_number, e_office_number, employee_id, employee_name, 
          designation_when_charges_issued_id, ulb_id, date_of_incident)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.fileNumber || null,
          caseData.eOfficeNumber || caseData.e_office_number || null,
          caseData.employeeId || caseData.employee_id || null,
          caseData.employeeName || caseData.name || null,
          caseData.designationWhenChargesIssuedId || caseData.designation_when_charges_issued_id || null,
          caseData.ulbId || caseData.ulb_id || null,
          caseData.dateOfIncident || caseData.date_of_incident || null
        ]
      );
    }

    // 3. Insert trap details
    if (caseData.employeeSuspended || caseData.criminalCaseFiled) {
      await connection.execute(
        `INSERT INTO case_trap_details 
         (case_id, employee_suspended, suspended_by, suspension_proceeding_number, suspension_date,
          employee_reinitiated, reinstated_by, reinitiation_proceeding_number, reinitiation_date,
          suspension_period_regularize, regularised_by, regularization_proceeding_number, regularization_date,
          criminal_case_filed, criminal_case_number, criminal_case_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.employeeSuspended || caseData.employee_suspended || '',
          caseData.suspendedBy || caseData.suspended_by || null,
          caseData.suspensionProceedingNumber || caseData.suspension_proceeding_number || null,
          caseData.suspensionDate || caseData.suspension_date || null,
          caseData.employeeReinitiated || caseData.employee_reinitiated || '',
          caseData.reinstatedBy || caseData.reinstated_by || null,
          caseData.reinitiationProceedingNumber || caseData.reinitiation_proceeding_number || null,
          caseData.reinitiationDate || caseData.reinitiation_date || null,
          caseData.suspensionPeriodRegularize || caseData.suspension_period_regularize || '',
          caseData.regularisedBy || caseData.regularised_by || null,
          caseData.regularizationProceedingNumber || caseData.regularization_proceeding_number || null,
          caseData.regularizationDate || caseData.regularization_date || null,
          caseData.criminalCaseFiled || caseData.criminal_case_filed || '',
          caseData.criminalCaseNumber || caseData.criminal_case_number || null,
          caseData.criminalCaseDate || caseData.criminal_case_date || null
        ]
      );
    }

    // 4. Insert prosecution and charges
    if (caseData.prosecutionSanctioned || caseData.chargesIssued) {
      await connection.execute(
        `INSERT INTO case_prosecution_charges 
         (case_id, prosecution_sanctioned, prosecution_issued_by, prosecution_proceeding_number, prosecution_date,
          charges_issued, charge_memo_number_and_date, charges_memo_number, charges_date, 
          charges_issued_remarks, endorcement_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.prosecutionSanctioned || caseData.prosecution_sanctioned || '',
          caseData.prosecutionIssuedBy || caseData.prosecution_issued_by || null,
          caseData.prosecutionProceedingNumber || caseData.prosecution_proceeding_number || null,
          caseData.prosecutionDate || caseData.prosecution_date || null,
          caseData.chargesIssued || caseData.charges_issued || '',
          caseData.chargeMemoNumberAndDate || caseData.charge_memo_number_and_date || null,
          caseData.chargesMemoNumber || caseData.charges_memo_number || null,
          caseData.chargesDate || caseData.charges_date || null,
          caseData.chargesIssuedRemarks || caseData.charges_issued_remarks || null,
          caseData.endorcementDate || caseData.endorcement_date || null
        ]
      );
    }

    // 5. Insert WSD
    if (caseData.wsdOrServedCopy) {
      await connection.execute(
        `INSERT INTO case_wsd 
         (case_id, wsd_or_served_copy, wsd_checkbox, served_copy_checkbox, further_action_wsd,
          further_action_wsd_others, conclude_text, wsd_issued_by, wsd_number, wsd_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.wsdOrServedCopy || caseData.wsd_or_served_copy || '',
          caseData.wsdCheckbox || caseData.wsd_checkbox || false,
          caseData.servedCopyCheckbox || caseData.served_copy_checkbox || false,
          caseData.furtherActionWSD || caseData.further_action_wsd || '',
          caseData.furtherActionWSDOthers || caseData.further_action_wsd_others || null,
          caseData.concludeText || caseData.conclude_text || null,
          caseData.wsdIssuedBy || caseData.wsd_issued_by || null,
          caseData.wsdNumber || caseData.wsd_number || null,
          caseData.wsdDate || caseData.wsd_date || null
        ]
      );
    }

    // 6. Insert IO & PO Appointment
    if (caseData.ioAppointment || caseData.poAppointment) {
      await connection.execute(
        `INSERT INTO case_io_po_appointment 
         (case_id, io_appointment, io_go_proceedings_number, io_appointment_date, 
          io_appointment_io_name, io_appointment_io_designation,
          po_appointment, po_go_proceedings_number, po_appointment_date,
          po_appointment_io_name, po_appointment_io_designation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.ioAppointment || caseData.io_appointment || '',
          caseData.ioGoProceedingsNumber || caseData.io_go_proceedings_number || null,
          caseData.ioAppointmentDate || caseData.io_appointment_date || null,
          caseData.ioAppointmentIOName || caseData.io_appointment_io_name || null,
          caseData.ioAppointmentIODesignation || caseData.io_appointment_io_designation || null,
          caseData.poAppointment || caseData.po_appointment || '',
          caseData.poGoProceedingsNumber || caseData.po_go_proceedings_number || null,
          caseData.poAppointmentDate || caseData.po_appointment_date || null,
          caseData.poAppointmentIOName || caseData.po_appointment_io_name || null,
          caseData.poAppointmentIODesignation || caseData.po_appointment_io_designation || null
        ]
      );
    }

    // 7. Insert Inquiry Report
    if (caseData.inquiryReportSubmitted) {
      await connection.execute(
        `INSERT INTO case_inquiry_report 
         (case_id, inquiry_report_submitted, inquiry_report_number, inquiry_report_date, inquiry_report_name,
          further_action_inquiry, inquiry_agreed_endorsement_date,
          inquiry_disagreed_action, inquiry_remitted_number, inquiry_remitted_date,
          inquiry_appointment_proceeding_number, inquiry_appointment_io_name, inquiry_appointment_io_date,
          inquiry_communication_endorsement_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.inquiryReportSubmitted || caseData.inquiry_report_submitted || '',
          caseData.inquiryReportNumber || caseData.inquiry_report_number || null,
          caseData.inquiryReportDate || caseData.inquiry_report_date || null,
          caseData.inquiryReportName || caseData.inquiry_report_name || null,
          caseData.furtherActionInquiry || caseData.further_action_inquiry || '',
          caseData.inquiryAgreedEndorsementDate || caseData.inquiry_agreed_endorsement_date || null,
          caseData.inquiryDisagreedAction || caseData.inquiry_disagreed_action || '',
          caseData.inquiryRemittedNumber || caseData.inquiry_remitted_number || null,
          caseData.inquiryRemittedDate || caseData.inquiry_remitted_date || null,
          caseData.inquiryAppointmentProceedingNumber || caseData.inquiry_appointment_proceeding_number || null,
          caseData.inquiryAppointmentIOName || caseData.inquiry_appointment_io_name || null,
          caseData.inquiryAppointmentIODate || caseData.inquiry_appointment_io_date || null,
          caseData.inquiryCommunicationEndorsementDate || caseData.inquiry_communication_endorsement_date || null
        ]
      );
    }

    // 8. Insert WR
    if (caseData.wrOrServedCopy) {
      await connection.execute(
        `INSERT INTO case_wr 
         (case_id, wr_or_served_copy, wr_checkbox, wr_served_copy_checkbox, further_action_wr,
          further_action_wr_remarks, wr_issued_by, punishment_number, punishment_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseId,
          caseData.wrOrServedCopy || caseData.wr_or_served_copy || '',
          caseData.wrCheckbox || caseData.wr_checkbox || false,
          caseData.wrServedCopyCheckbox || caseData.wr_served_copy_checkbox || false,
          caseData.furtherActionWR || caseData.further_action_wr || '',
          caseData.furtherActionWRRemarks || caseData.further_action_wr_remarks || null,
          caseData.wrIssuedBy || caseData.wr_issued_by || null,
          caseData.punishmentNumber || caseData.punishment_number || null,
          caseData.punishmentDate || caseData.punishment_date || null
        ]
      );
    }

    // 9. Insert Remarks
    if (caseData.remarks) {
      await connection.execute(
        'INSERT INTO case_remarks (case_id, remarks) VALUES (?, ?)',
        [caseId, caseData.remarks]
      );
    }

    return await buildCompleteCase(caseId);
  });
};

// Update case with all sections
const update = async (id, caseData) => {
  return await db.transaction(async (connection) => {
    // 1. Update main case
    if (caseData.caseCategoryId || caseData.statusId || caseData.severityId) {
      await connection.execute(
        `UPDATE disciplinary_cases 
         SET case_category_id = COALESCE(?, case_category_id),
             case_sub_category_id = COALESCE(?, case_sub_category_id),
             case_type = COALESCE(?, case_type),
             status_id = COALESCE(?, status_id),
             severity_id = COALESCE(?, severity_id),
             updated_by = COALESCE(?, updated_by),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          caseData.caseCategoryId || caseData.case_category_id,
          caseData.caseSubCategoryId || caseData.case_sub_category_id,
          caseData.caseType || caseData.case_type,
          caseData.statusId || caseData.status_id,
          caseData.severityId || caseData.severity_id,
          caseData.updatedBy || caseData.updated_by,
          id
        ]
      );
    }

    // 2. Update or insert basic info
    await connection.execute(
      `INSERT INTO case_basic_info 
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
         updated_at = CURRENT_TIMESTAMP`,
      [
        id,
        caseData.fileNumber,
        caseData.eOfficeNumber || caseData.e_office_number,
        caseData.employeeId || caseData.employee_id,
        caseData.employeeName || caseData.name,
        caseData.designationWhenChargesIssuedId || caseData.designation_when_charges_issued_id,
        caseData.ulbId || caseData.ulb_id,
        caseData.dateOfIncident || caseData.date_of_incident
      ]
    );

    // Similar pattern for other sections - using INSERT ... ON DUPLICATE KEY UPDATE
    // This ensures we update if exists, insert if not
    
    // Update trap details
    if (caseData.employeeSuspended !== undefined || caseData.criminalCaseFiled !== undefined) {
      await connection.execute(
        `INSERT INTO case_trap_details 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.employeeSuspended || caseData.employee_suspended || '',
          caseData.suspendedBy || caseData.suspended_by,
          caseData.suspensionProceedingNumber || caseData.suspension_proceeding_number,
          caseData.suspensionDate || caseData.suspension_date,
          caseData.employeeReinitiated || caseData.employee_reinitiated || '',
          caseData.reinstatedBy || caseData.reinstated_by,
          caseData.reinitiationProceedingNumber || caseData.reinitiation_proceeding_number,
          caseData.reinitiationDate || caseData.reinitiation_date,
          caseData.suspensionPeriodRegularize || caseData.suspension_period_regularize || '',
          caseData.regularisedBy || caseData.regularised_by,
          caseData.regularizationProceedingNumber || caseData.regularization_proceeding_number,
          caseData.regularizationDate || caseData.regularization_date,
          caseData.criminalCaseFiled || caseData.criminal_case_filed || '',
          caseData.criminalCaseNumber || caseData.criminal_case_number,
          caseData.criminalCaseDate || caseData.criminal_case_date
        ]
      );
    }

    // Update prosecution and charges
    if (caseData.prosecutionSanctioned !== undefined || caseData.chargesIssued !== undefined) {
      await connection.execute(
        `INSERT INTO case_prosecution_charges 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.prosecutionSanctioned || caseData.prosecution_sanctioned || '',
          caseData.prosecutionIssuedBy || caseData.prosecution_issued_by,
          caseData.prosecutionProceedingNumber || caseData.prosecution_proceeding_number,
          caseData.prosecutionDate || caseData.prosecution_date,
          caseData.chargesIssued || caseData.charges_issued || '',
          caseData.chargeMemoNumberAndDate || caseData.charge_memo_number_and_date,
          caseData.chargesMemoNumber || caseData.charges_memo_number,
          caseData.chargesDate || caseData.charges_date,
          caseData.chargesIssuedRemarks || caseData.charges_issued_remarks,
          caseData.endorcementDate || caseData.endorcement_date
        ]
      );
    }

    // Update WSD
    if (caseData.wsdOrServedCopy !== undefined) {
      await connection.execute(
        `INSERT INTO case_wsd 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.wsdOrServedCopy || caseData.wsd_or_served_copy || '',
          caseData.wsdCheckbox || caseData.wsd_checkbox || false,
          caseData.servedCopyCheckbox || caseData.served_copy_checkbox || false,
          caseData.furtherActionWSD || caseData.further_action_wsd || '',
          caseData.furtherActionWSDOthers || caseData.further_action_wsd_others,
          caseData.concludeText || caseData.conclude_text,
          caseData.wsdIssuedBy || caseData.wsd_issued_by,
          caseData.wsdNumber || caseData.wsd_number,
          caseData.wsdDate || caseData.wsd_date
        ]
      );
    }

    // Update IO & PO Appointment
    if (caseData.ioAppointment !== undefined || caseData.poAppointment !== undefined) {
      await connection.execute(
        `INSERT INTO case_io_po_appointment 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.ioAppointment || caseData.io_appointment || '',
          caseData.ioGoProceedingsNumber || caseData.io_go_proceedings_number,
          caseData.ioAppointmentDate || caseData.io_appointment_date,
          caseData.ioAppointmentIOName || caseData.io_appointment_io_name,
          caseData.ioAppointmentIODesignation || caseData.io_appointment_io_designation,
          caseData.poAppointment || caseData.po_appointment || '',
          caseData.poGoProceedingsNumber || caseData.po_go_proceedings_number,
          caseData.poAppointmentDate || caseData.po_appointment_date,
          caseData.poAppointmentIOName || caseData.po_appointment_io_name,
          caseData.poAppointmentIODesignation || caseData.po_appointment_io_designation
        ]
      );
    }

    // Update Inquiry Report
    if (caseData.inquiryReportSubmitted !== undefined) {
      await connection.execute(
        `INSERT INTO case_inquiry_report 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.inquiryReportSubmitted || caseData.inquiry_report_submitted || '',
          caseData.inquiryReportNumber || caseData.inquiry_report_number,
          caseData.inquiryReportDate || caseData.inquiry_report_date,
          caseData.inquiryReportName || caseData.inquiry_report_name,
          caseData.furtherActionInquiry || caseData.further_action_inquiry || '',
          caseData.inquiryAgreedEndorsementDate || caseData.inquiry_agreed_endorsement_date,
          caseData.inquiryDisagreedAction || caseData.inquiry_disagreed_action || '',
          caseData.inquiryRemittedNumber || caseData.inquiry_remitted_number,
          caseData.inquiryRemittedDate || caseData.inquiry_remitted_date,
          caseData.inquiryAppointmentProceedingNumber || caseData.inquiry_appointment_proceeding_number,
          caseData.inquiryAppointmentIOName || caseData.inquiry_appointment_io_name,
          caseData.inquiryAppointmentIODate || caseData.inquiry_appointment_io_date,
          caseData.inquiryCommunicationEndorsementDate || caseData.inquiry_communication_endorsement_date
        ]
      );
    }

    // Update WR
    if (caseData.wrOrServedCopy !== undefined) {
      await connection.execute(
        `INSERT INTO case_wr 
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
           updated_at = CURRENT_TIMESTAMP`,
        [
          id,
          caseData.wrOrServedCopy || caseData.wr_or_served_copy || '',
          caseData.wrCheckbox || caseData.wr_checkbox || false,
          caseData.wrServedCopyCheckbox || caseData.wr_served_copy_checkbox || false,
          caseData.furtherActionWR || caseData.further_action_wr || '',
          caseData.furtherActionWRRemarks || caseData.further_action_wr_remarks,
          caseData.wrIssuedBy || caseData.wr_issued_by,
          caseData.punishmentNumber || caseData.punishment_number,
          caseData.punishmentDate || caseData.punishment_date
        ]
      );
    }

    // Update Remarks
    if (caseData.remarks !== undefined) {
      await connection.execute(
        `INSERT INTO case_remarks (case_id, remarks) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
           remarks = VALUES(remarks),
           updated_at = CURRENT_TIMESTAMP`,
        [id, caseData.remarks]
      );
    }

    return await buildCompleteCase(id);
  });
};

// Delete case (CASCADE will handle related tables)
const deleteCase = async (id) => {
  const result = await db.query('DELETE FROM disciplinary_cases WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Find cases by employee ID
const findByEmployeeId = async (employeeId) => {
  const results = await db.query(
    `SELECT dc.id, dc.case_type, dc.created_at,
            cbi.file_number, cbi.employee_id, cbi.employee_name, 
            cc.category_name as categoryOfCase,
            csc.sub_category_name as subCategoryOfCase,
            cs.status_name as status
     FROM disciplinary_cases dc
     LEFT JOIN case_basic_info cbi ON dc.id = cbi.case_id
     LEFT JOIN case_categories cc ON dc.case_category_id = cc.id
     LEFT JOIN case_sub_categories csc ON dc.case_sub_category_id = csc.id
     LEFT JOIN case_statuses cs ON dc.status_id = cs.id
     WHERE cbi.employee_id = ?
     ORDER BY dc.created_at DESC`,
    [employeeId]
  );
  return results;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteCase,
  findByEmployeeId
};
