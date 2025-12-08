import React, { useState, useEffect } from 'react';

const DisciplinaryCaseForm = ({ onSubmit, initialData = {}, isEdit = false, onCancel, onFormSubmitted, isFormSubmitted: parentIsFormSubmitted, onFinalSubmit }) => {
  const [formData, setFormData] = useState({
    fileNumber: initialData.fileNumber || '',
    eOfficeNumber: initialData.eOfficeNumber || '',
    employeeId: initialData.employeeId || '',
    name: initialData.name || '',
    designationWhenChargesIssued: initialData.designationWhenChargesIssued || '',
    nameOfULB: initialData.nameOfULB || '',
    caseType: initialData.caseType || 'Trap Case',
    
    // Trap case fields
    dateOfIncident: initialData.dateOfIncident || '',
    employeeSuspended: initialData.employeeSuspended || '',
    suspendedBy: initialData.suspendedBy || '',
    suspensionProceedingNumber: initialData.suspensionProceedingNumber || '',
    suspensionDate: initialData.suspensionDate || '',
    employeeReinitiated: initialData.employeeReinitiated || '',
    reinstatedBy: initialData.reinstatedBy || '',
    reinitiationProceedingNumber: initialData.reinitiationProceedingNumber || '',
    reinitiationDate: initialData.reinitiationDate || '',
    suspensionPeriodRegularize: initialData.suspensionPeriodRegularize || '',
    regularisedBy: initialData.regularisedBy || '',
    regularizationProceedingNumber: initialData.regularizationProceedingNumber || '',
    regularizationDate: initialData.regularizationDate || '',
    criminalCaseFiled: initialData.criminalCaseFiled || '',
    criminalCaseNumber: initialData.criminalCaseNumber || '',
    criminalCaseDate: initialData.criminalCaseDate || '',
    
    // Prosecution and charges
    prosecutionSanctioned: initialData.prosecutionSanctioned || '',
    prosecutionIssuedBy: initialData.prosecutionIssuedBy || '',
    prosecutionProceedingNumber: initialData.prosecutionProceedingNumber || '',
    prosecutionDate: initialData.prosecutionDate || '',
    chargesIssued: initialData.chargesIssued || '',
    chargeMemoNumberAndDate: initialData.chargeMemoNumberAndDate || '',
    chargesMemoNumber: initialData.chargesMemoNumber || '',
    chargesDate: initialData.chargesDate || '',
    chargesIssuedRemarks: initialData.chargesIssuedRemarks || '',
    endorcementDate: initialData.endorcementDate || '',
    
    // WSD fields
    wsdOrServedCopy: initialData.wsdOrServedCopy || '',
    wsdCheckbox: initialData.wsdCheckbox || false,
    servedCopyCheckbox: initialData.servedCopyCheckbox || false,
    furtherActionWSD: initialData.furtherActionWSD || '',
    furtherActionWSDOthers: initialData.furtherActionWSDOthers || '',
    concludeText: initialData.concludeText || '',
    wsdIssuedBy: initialData.wsdIssuedBy || '',
    wsdNumber: initialData.wsdNumber || '',
    wsdDate: initialData.wsdDate || '',
    ioAppointment: initialData.ioAppointment || '',
    ioGoProceedingsNumber: initialData.ioGoProceedingsNumber || '',
    ioAppointmentDate: initialData.ioAppointmentDate || '',
    ioAppointmentIOName: initialData.ioAppointmentIOName || '',
    ioAppointmentIODesignation: initialData.ioAppointmentIODesignation || '',
    poAppointment: initialData.poAppointment || '',
    poGoProceedingsNumber: initialData.poGoProceedingsNumber || '',
    poAppointmentDate: initialData.poAppointmentDate || '',
    poAppointmentIOName: initialData.poAppointmentIOName || '',
    poAppointmentIODesignation: initialData.poAppointmentIODesignation || '',
    
    // Inquiry report fields
    inquiryReportSubmitted: initialData.inquiryReportSubmitted || '',
    inquiryReportNumber: initialData.inquiryReportNumber || '',
    inquiryReportDate: initialData.inquiryReportDate || '',
    inquiryReportName: initialData.inquiryReportName || '',
    furtherActionInquiry: initialData.furtherActionInquiry || '',
    inquiryDisagreedAction: initialData.inquiryDisagreedAction || '',
    inquiryAppointmentProceedingNumber: initialData.inquiryAppointmentProceedingNumber || '',
    inquiryAppointmentIOName: initialData.inquiryAppointmentIOName || '',
    inquiryAppointmentIODate: initialData.inquiryAppointmentIODate || '',
    inquiryRemittedNumber: initialData.inquiryRemittedNumber || '',
    inquiryRemittedDate: initialData.inquiryRemittedDate || '',
    inquiryCommunicationEndorsementDate: initialData.inquiryCommunicationEndorsementDate || '',
    
    // WR fields
    wrOrServedCopy: initialData.wrOrServedCopy || '',
    wrCheckbox: initialData.wrCheckbox || false,
    wrServedCopyCheckbox: initialData.wrServedCopyCheckbox || false,
    furtherActionWR: initialData.furtherActionWR || '',
    furtherActionWRRemarks: initialData.furtherActionWRRemarks || '',
    wrIssuedBy: initialData.wrIssuedBy || '',
    punishmentNumber: initialData.punishmentNumber || '',
    punishmentDate: initialData.punishmentDate || '',
    
    // Remarks
    remarks: initialData.remarks || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmployees, setSubmittedEmployees] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState(null);

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  // Sync with parent submission state
  useEffect(() => {
    if (parentIsFormSubmitted !== undefined) {
      setIsSubmitted(parentIsFormSubmitted);
    }
  }, [parentIsFormSubmitted]);

  // Sync caseType when initialData changes
  useEffect(() => {
    if (initialData.caseType && initialData.caseType !== formData.caseType) {
      setFormData(prev => ({
        ...prev,
        caseType: initialData.caseType
      }));
    }
    if (initialData.subCategoryOfCase && initialData.subCategoryOfCase !== formData.caseType) {
      setFormData(prev => ({
        ...prev,
        caseType: initialData.subCategoryOfCase
      }));
    }
  }, [initialData.caseType, initialData.subCategoryOfCase]);

  // Dummy data for dropdowns
  const designations = [
    'Junior Clerk',
    'Senior Clerk',
    'Section Officer',
    'Assistant Director',
    'Deputy Director',
    'Director'
  ];

  const ulbOptions = [
    // 4 RDMA offices
    'RDMA Rajahmundry',
    'RDMA Vishakapatnam',
    'RDMA Guntur',
    'RDMA Ananthapuram',
    // C&DMA office
    'C&DMA Office',
    // Urban development authorities
    'Urban Development Authority 1',
    'Urban Development Authority 2',
    'Urban Development Authority 3',
    'Urban Development Authority 4',
    'Urban Development Authority 5',
    // 123 ULB's
    'Visakhapatnam Municipal Corporation',
    'Vizianagaram Municipal Corporation',
    'Srikakulam Municipal Corporation',
    'Rajahmundry Municipal Corporation',
    'Kakinada Municipal Corporation',
    'Eluru Municipal Corporation',
    'Vijayawada Municipal Corporation',
    'Machilipatnam Municipal Corporation',
    'Guntur Municipal Corporation',
    'Ongole Municipal Corporation',
    'Nellore Municipal Corporation',
    'Tirupati Municipal Corporation',
    'Chittoor Municipal Corporation',
    'Anantapur Municipal Corporation',
    'Kurnool Municipal Corporation',
    'Kadapa Municipal Corporation',
    'Nandyal Municipal Corporation',
    'Amadalavalasa',
    'Ichchapuram',
    'Palasa-Kasibugga',
    'Sompeta',
    'Bobbili',
    'Parvathipuram',
    'Salur',
    'Chipurupalli',
    'Anakapalle',
    'Bheemunipatnam',
    'Narsipatnam',
    'Amalapuram',
    'Ramachandrapuram',
    'Gollaprolu',
    'Bhimavaram',
    'Tadepalligudem',
    'Narasapuram',
    'Palakollu',
    'Gudivada',
    'Pedana',
    'Tiruvuru',
    'Nuzvid',
    'Narasaraopet',
    'Sattenapalli',
    'Ponnur',
    'Repalle',
    'Chirala',
    'Markapur',
    'Addanki',
    'Gudur',
    'Kavali',
    'Sullurpeta',
    'Madanapalle',
    'Punganur',
    'Nagari',
    'Palamaner',
    'Gooty',
    'Tadipatri',
    'Rayadurg',
    'Uravakonda',
    'Adoni',
    'Yemmiganur',
    'Nandikotkur',
    'Proddatur',
    'Badvel',
    'Mydukur',
    'Kaviti',
    'Harishchandrapuram',
    'Kothavalasa',
    'Gajapathinagaram',
    'Chodavaram',
    'Yelamanchili',
    'Paderu',
    'Mandapeta',
    'Samalkot',
    'Kotipalli',
    'Yeleswaram',
    'Akiveedu',
    'Attili',
    'Penugonda',
    'Kankipadu',
    'Poranki',
    'Mangalagiri',
    'Tenali Rural',
    'Podili',
    'Darsi',
    'Naidupeta',
    'Venkatagiri',
    'Chandragiri',
    'Srikalahasti',
    'Kuppam',
    'Kalyandurg',
    'Bukkapatnam',
    'Koilakuntla',
    'Allagadda',
    'Kamalapuram',
    'Jammalamadugu',
    'Tadwai',
    'Pathapatnam',
    'Meliaputti',
    'Veeraghattam',
    'Santhabommali',
    'Devarapalli',
    'Nathavaram',
    'Koyyuru',
    'Etikoppaka',
    'Prathipadu',
    'Pedapudi',
    'Kovvur Rural',
    'Tallapudi',
    'Veeravasaram',
    'Movva',
    'Koduru',
    'Chilakaluripet Rural',
    'Inkollu',
    'Chejerla',
    'Buchireddypalem Rural',
    'Rayachoti',
    'Pileru',
    'Penukonda',
    'Hindupur Rural',
    'Dhone',
    'Panyam',
    'Pullampeta',
    'Nandalur',
    'Tallaproddutur'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear furtherActionWSD fields when furtherActionWSD changes
    if (name === 'furtherActionWSD') {
      if (value !== 'others') {
        setFormData(prev => ({
          ...prev,
          furtherActionWSDOthers: ''
        }));
      }
      if (value !== 'conclude' && value !== 'others') {
        setFormData(prev => ({
          ...prev,
          concludeText: '',
          wsdIssuedBy: '',
          wsdNumber: '',
          wsdDate: ''
        }));
      }
      if (value === 'conclude') {
        setFormData(prev => ({
          ...prev,
          furtherActionWSDOthers: ''
        }));
      }
      if (value === 'others') {
        setFormData(prev => ({
          ...prev,
          concludeText: ''
        }));
      }
    }

    // Clear furtherActionWRRemarks when furtherActionWR changes to something other than 'others'
    if (name === 'furtherActionWR' && value !== 'others') {
      setFormData(prev => ({
        ...prev,
        furtherActionWRRemarks: ''
      }));
    }
    // Clear wrIssuedBy when furtherActionWR is cleared or set to 'others'
    if (name === 'furtherActionWR' && (!value || value === 'others')) {
      setFormData(prev => ({
        ...prev,
        wrIssuedBy: ''
      }));
    }

    // Clear inquiry dependent fields when furtherActionInquiry changes
    if (name === 'furtherActionInquiry') {
      if (value !== 'disagreed') {
        setFormData(prev => ({
          ...prev,
          inquiryDisagreedAction: '',
          inquiryAppointmentProceedingNumber: '',
          inquiryAppointmentIOName: '',
          inquiryAppointmentIODate: '',
          inquiryRemittedNumber: '',
          inquiryRemittedDate: '',
          inquiryCommunicationEndorsementDate: ''
        }));
      }
    }

    // Clear inquiry disagreed action fields when inquiryDisagreedAction changes
    if (name === 'inquiryDisagreedAction') {
      if (value !== 'appointment') {
        setFormData(prev => ({
          ...prev,
          inquiryAppointmentProceedingNumber: '',
          inquiryAppointmentIOName: '',
          inquiryAppointmentIODate: ''
        }));
      }
      if (value !== 'remitted') {
        setFormData(prev => ({
          ...prev,
          inquiryRemittedNumber: '',
          inquiryRemittedDate: ''
        }));
      }
      if (value !== 'communication') {
        setFormData(prev => ({
          ...prev,
          inquiryCommunicationEndorsementDate: ''
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleYesNoChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear dependent fields when switching to 'no'
    if (value === 'no') {
      const dependentFields = getDependentFields(fieldName);
      dependentFields.forEach(field => {
        setFormData(prev => ({
          ...prev,
          [field]: field.includes('Checkbox') ? false : ''
        }));
      });
    }
  };

  const getDependentFields = (fieldName) => {
    const dependencyMap = {
      employeeSuspended: ['suspendedBy', 'suspensionProceedingNumber', 'suspensionDate', 'employeeReinitiated', 'reinitiationProceedingNumber', 'reinitiationDate', 'suspensionPeriodRegularize', 'regularisedBy', 'regularizationProceedingNumber', 'regularizationDate'],
      employeeReinitiated: ['reinstatedBy', 'reinitiationProceedingNumber', 'reinitiationDate', 'suspensionPeriodRegularize', 'regularisedBy', 'regularizationProceedingNumber', 'regularizationDate'],
      suspensionPeriodRegularize: ['regularisedBy', 'regularizationProceedingNumber', 'regularizationDate'],
      criminalCaseFiled: ['criminalCaseNumber', 'criminalCaseDate'],
      prosecutionSanctioned: ['prosecutionIssuedBy', 'prosecutionProceedingNumber', 'prosecutionDate'],
      chargesIssued: ['chargeMemoNumberAndDate', 'chargesMemoNumber', 'chargesDate', 'chargesIssuedRemarks'],
      wsdOrServedCopy: ['wsdCheckbox', 'servedCopyCheckbox', 'furtherActionWSD', 'furtherActionWSDOthers', 'concludeText', 'ioAppointment', 'ioGoProceedingsNumber', 'ioAppointmentDate', 'ioAppointmentIOName', 'ioAppointmentIODesignation', 'poAppointment', 'poGoProceedingsNumber', 'poAppointmentDate', 'poAppointmentIOName', 'poAppointmentIODesignation'],
      furtherActionWSD: ['furtherActionWSDOthers', 'concludeText', 'wsdIssuedBy', 'wsdNumber', 'wsdDate'],
      ioAppointment: ['ioGoProceedingsNumber', 'ioAppointmentDate', 'ioAppointmentIOName', 'ioAppointmentIODesignation'],
      poAppointment: ['poGoProceedingsNumber', 'poAppointmentDate', 'poAppointmentIOName', 'poAppointmentIODesignation'],
      inquiryReportSubmitted: ['inquiryReportNumber', 'inquiryReportDate', 'inquiryReportName', 'furtherActionInquiry', 'inquiryDisagreedAction', 'inquiryAppointmentProceedingNumber', 'inquiryAppointmentIOName', 'inquiryAppointmentIODate'],
      furtherActionInquiry: ['inquiryDisagreedAction', 'inquiryAppointmentProceedingNumber', 'inquiryAppointmentIOName', 'inquiryAppointmentIODate'],
      inquiryDisagreedAction: ['inquiryAppointmentProceedingNumber', 'inquiryAppointmentIOName', 'inquiryAppointmentIODate', 'inquiryRemittedNumber', 'inquiryRemittedDate', 'inquiryCommunicationEndorsementDate'],
      wrOrServedCopy: ['wrCheckbox', 'wrServedCopyCheckbox', 'furtherActionWR', 'furtherActionWRRemarks', 'wrIssuedBy', 'punishmentNumber', 'punishmentDate'],
      furtherActionWR: ['furtherActionWRRemarks', 'wrIssuedBy']
    };
    return dependencyMap[fieldName] || [];
  };

  const validate = () => {
    const newErrors = {};
    
    // Note: employeeId is optional and not validated
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.designationWhenChargesIssued) {
      newErrors.designationWhenChargesIssued = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to clear form while preserving file number and e-office number
  const clearFormExceptFileData = () => {
    const preservedFileNumber = formData.fileNumber;
    const preservedEOfficeNumber = formData.eOfficeNumber;
    const preservedCaseType = formData.caseType || initialData.caseType || 'Trap Case';
    
    setFormData(prev => ({
      // Preserve file number and e-office number
      fileNumber: preservedFileNumber,
      eOfficeNumber: preservedEOfficeNumber,
      // Keep case type from initialData
      caseType: preservedCaseType,
      
      // Clear all other fields
      employeeId: '',
      name: '',
      designationWhenChargesIssued: '',
      nameOfULB: '',
      
      // Clear trap case fields
      dateOfIncident: '',
      employeeSuspended: '',
      suspendedBy: '',
      suspensionProceedingNumber: '',
      suspensionDate: '',
      employeeReinitiated: '',
      reinstatedBy: '',
      reinitiationProceedingNumber: '',
      reinitiationDate: '',
      suspensionPeriodRegularize: '',
      regularisedBy: '',
      regularizationProceedingNumber: '',
      regularizationDate: '',
      criminalCaseFiled: '',
      criminalCaseNumber: '',
      criminalCaseDate: '',
      
      // Clear prosecution and charges
      prosecutionSanctioned: '',
      prosecutionIssuedBy: '',
      prosecutionProceedingNumber: '',
      prosecutionDate: '',
      chargesIssued: '',
      chargeMemoNumberAndDate: '',
      chargesMemoNumber: '',
      chargesDate: '',
      chargesIssuedRemarks: '',
      endorcementDate: '',
      
      // Clear WSD fields
      wsdOrServedCopy: '',
      wsdCheckbox: false,
      servedCopyCheckbox: false,
      furtherActionWSD: '',
      furtherActionWSDOthers: '',
      concludeText: '',
      wsdIssuedBy: '',
      wsdNumber: '',
      wsdDate: '',
      ioAppointment: '',
      ioGoProceedingsNumber: '',
      ioAppointmentDate: '',
      ioAppointmentIOName: '',
      ioAppointmentIODesignation: '',
      poAppointment: '',
      poGoProceedingsNumber: '',
      poAppointmentDate: '',
      poAppointmentIOName: '',
      poAppointmentIODesignation: '',
      
      // Clear inquiry report fields
      inquiryReportSubmitted: '',
      inquiryReportNumber: '',
      inquiryReportDate: '',
      inquiryReportName: '',
      furtherActionInquiry: '',
      inquiryDisagreedAction: '',
      inquiryAppointmentProceedingNumber: '',
      inquiryAppointmentIOName: '',
      inquiryAppointmentIODate: '',
      inquiryRemittedNumber: '',
      inquiryRemittedDate: '',
      inquiryCommunicationEndorsementDate: '',
      // Clear WR fields
      wrOrServedCopy: '',
      wrCheckbox: false,
      wrServedCopyCheckbox: false,
      furtherActionWR: '',
      furtherActionWRRemarks: '',
      wrIssuedBy: '',
      punishmentNumber: '',
      punishmentDate: '',
      
      // Clear remarks
      remarks: '',
    }));
    setErrors({});
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log('Next button clicked');
    console.log('Form data:', formData);
    
    // Validate form
    const isValid = validate();
    console.log('Validation result:', isValid);
    
    // Get current errors after validation
    const currentErrors = {};
    if (!formData.name.trim()) {
      currentErrors.name = 'Name is required';
    }
    if (!formData.designationWhenChargesIssued) {
      currentErrors.designationWhenChargesIssued = 'Designation is required';
    }
    
    console.log('Current errors:', currentErrors);
    
    if (!isValid || Object.keys(currentErrors).length > 0) {
      console.log('Validation failed, showing errors');
      setErrors(currentErrors);
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = Object.keys(currentErrors)[0];
        if (firstErrorField) {
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }
      }, 100);
      return;
    }
    
    // Add current employee to submitted employees list (deep copy to preserve all data)
    const newEmployee = {
      ...formData,
      id: Date.now().toString(), // Unique ID for this employee entry
      timestamp: new Date().toISOString(),
    };
    
    setSubmittedEmployees(prev => [...prev, newEmployee]);
    setIsSubmitted(true);
    if (onFormSubmitted) {
      onFormSubmitted(true);
    }
    
    // Clear form except file number and e-office number
    clearFormExceptFileData();
    
    // Scroll to table view
    setTimeout(() => {
      const tableElement = document.querySelector('[data-submitted-employees-table]');
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFinalSubmit = async () => {
    if (submittedEmployees.length === 0) {
      alert('Please add at least one employee before submitting.');
      return;
    }

    setIsSubmitting(true);
    setIsFinalSubmitted(true); // Disable form immediately when submit starts
    try {
      // Call final submit callback to submit all employees and handle redirect
      if (onFinalSubmit) {
        await onFinalSubmit(submittedEmployees);
      } else {
        // Fallback: submit all employees here if callback not provided
        for (const employee of submittedEmployees) {
          if (onSubmit) {
            await onSubmit(employee);
          }
        }
        alert('All cases submitted successfully!');
        window.location.href = '/cases/new';
      }
    } catch (error) {
      console.error('Error submitting cases:', error);
      setIsFinalSubmitted(false); // Re-enable form if submission fails
      alert(`Failed to submit cases: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view employee
  const handleViewEmployee = (employee) => {
    setViewingEmployee(employee);
    setExpandedEmployeeId(null); // Close any expanded view
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    // Create a copy without id and timestamp fields for form
    const { id, timestamp, ...employeeFormData } = employee;
    // Load employee data into form
    setFormData(employeeFormData);
    setErrors({});
    // Remove from submitted employees list
    setSubmittedEmployees(prev => prev.filter(emp => emp.id !== employee.id));
    // Reset submission state to allow editing
    setIsSubmitted(false);
    if (onFormSubmitted) {
      onFormSubmitted(false);
    }
    // Scroll to top of form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setExpandedEmployeeId(null);
  };

  // Handle delete confirmation
  const handleDeleteEmployee = (employee) => {
    setDeleteConfirmEmployee(employee);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirmEmployee) {
      setSubmittedEmployees(prev => prev.filter(emp => emp.id !== deleteConfirmEmployee.id));
      setDeleteConfirmEmployee(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmEmployee(null);
  };

  const handleAddEmployee = () => {
    clearFormExceptFileData();
  };

  // Yes/No radio button component
  const YesNoButtons = ({ fieldName, value, onChange, label, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={fieldName}
            value="yes"
            checked={value === 'yes'}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Yes</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={fieldName}
            value="no"
            checked={value === 'no'}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">No</span>
        </label>
      </div>
    </div>
  );

  // Get subcategory name for section title
  // Priority: initialData.subCategoryOfCase > initialData.caseType > formData.caseType > default
  const subCategoryName = initialData.subCategoryOfCase || initialData.caseType || formData.caseType || 'Case';

  // Check if WSD further action should be shown (if WSD checkbox is selected, or both checkboxes are selected)
  const showWSDFurtherAction = formData.wsdOrServedCopy === 'yes' && formData.wsdCheckbox;

  // Check if WR further action should be shown (if WR checkbox is selected, or both checkboxes are selected)
  const showWRFurtherAction = formData.wrOrServedCopy === 'yes' && formData.wrCheckbox;

  // Determine if form should be disabled (after final submit)
  const isFormDisabled = isFinalSubmitted;

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <fieldset disabled={isFormDisabled} className={isFormDisabled ? 'opacity-75' : ''}>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-6">
        {/* Basic Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Number
              </label>
              <input
                type="text"
                name="fileNumber"
                value={formData.fileNumber}
                onChange={handleChange}
                disabled={isSubmitted || isFinalSubmitted}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSubmitted || isFinalSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Office Number
              </label>
              <input
                type="text"
                name="eOfficeNumber"
                value={formData.eOfficeNumber}
                onChange={handleChange}
                disabled={isSubmitted || isFinalSubmitted}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSubmitted || isFinalSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation when charges issued <span className="text-red-500">*</span>
              </label>
              <select
                name="designationWhenChargesIssued"
                value={formData.designationWhenChargesIssued}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.designationWhenChargesIssued ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Designation</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              {errors.designationWhenChargesIssued && (
                <p className="mt-1 text-sm text-red-600">{errors.designationWhenChargesIssued}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of the ULB
              </label>
              <select
                name="nameOfULB"
                value={formData.nameOfULB}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="">Select ULB</option>
                {ulbOptions.map((ulb, index) => (
                  <option key={index} value={ulb}>
                    {ulb}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Type
              </label>
              <input
                type="text"
                name="caseType"
                value={formData.caseType}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Subcategory Details Section - Always show for all subcategories */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            {subCategoryName} Details
          </h2>
          <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Incident
                </label>
                <input
                  type="date"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  max={today}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <YesNoButtons
                fieldName="employeeSuspended"
                value={formData.employeeSuspended}
                onChange={handleYesNoChange}
                label="Employee suspended or not"
              />

              {formData.employeeSuspended === 'yes' && (
                <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suspended by
                    </label>
                    <input
                      type="text"
                      name="suspendedBy"
                      value={formData.suspendedBy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proceeding Number
                      </label>
                      <input
                        type="text"
                        name="suspensionProceedingNumber"
                        value={formData.suspensionProceedingNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="suspensionDate"
                        value={formData.suspensionDate}
                        onChange={handleChange}
                        max={today}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <YesNoButtons
                    fieldName="employeeReinitiated"
                    value={formData.employeeReinitiated}
                    onChange={handleYesNoChange}
                    label="Employee re-initiated or not"
                  />

                  {formData.employeeReinitiated === 'yes' && (
                    <div className="ml-6 space-y-4 bg-blue-50 p-4 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Re-instated by
                        </label>
                        <input
                          type="text"
                          name="reinstatedBy"
                          value={formData.reinstatedBy}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proceeding Number
                          </label>
                          <input
                            type="text"
                            name="reinitiationProceedingNumber"
                            value={formData.reinitiationProceedingNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            name="reinitiationDate"
                            value={formData.reinitiationDate}
                            onChange={handleChange}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.employeeReinitiated === 'yes' && (
                    <>
                      <YesNoButtons
                        fieldName="suspensionPeriodRegularize"
                        value={formData.suspensionPeriodRegularize}
                        onChange={handleYesNoChange}
                        label="Suspension Period Regularize or not"
                      />

                      {formData.suspensionPeriodRegularize === 'yes' && (
                    <div className="ml-6 space-y-4 bg-green-50 p-4 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Regularised by
                        </label>
                        <textarea
                          name="regularisedBy"
                          value={formData.regularisedBy}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proceeding Number
                          </label>
                          <input
                            type="text"
                            name="regularizationProceedingNumber"
                            value={formData.regularizationProceedingNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            name="regularizationDate"
                            value={formData.regularizationDate}
                            onChange={handleChange}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <YesNoButtons
                fieldName="criminalCaseFiled"
                value={formData.criminalCaseFiled}
                onChange={handleYesNoChange}
                label="Criminal case filed or not"
              />

              {formData.criminalCaseFiled === 'yes' && (
                <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Case Number
                      </label>
                      <input
                        type="text"
                        name="criminalCaseNumber"
                        value={formData.criminalCaseNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="criminalCaseDate"
                        value={formData.criminalCaseDate}
                        onChange={handleChange}
                        max={today}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Prosecution and Charges Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Prosecution and Charges
          </h2>
          <div className="space-y-6">
            <YesNoButtons
              fieldName="prosecutionSanctioned"
              value={formData.prosecutionSanctioned}
              onChange={handleYesNoChange}
              label="Prosecution Sanctioned"
            />

            {formData.prosecutionSanctioned === 'yes' && (
              <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issued by
                    </label>
                    <input
                      type="text"
                      name="prosecutionIssuedBy"
                      value={formData.prosecutionIssuedBy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proceeding Number
                    </label>
                    <input
                      type="text"
                      name="prosecutionProceedingNumber"
                      value={formData.prosecutionProceedingNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="prosecutionDate"
                      value={formData.prosecutionDate}
                      onChange={handleChange}
                      max={today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <YesNoButtons
              fieldName="chargesIssued"
              value={formData.chargesIssued}
              onChange={handleYesNoChange}
              label="Charges issued"
            />

            {formData.chargesIssued === 'yes' && (
              <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issued By
                    </label>
                    <input
                      type="text"
                      name="chargeMemoNumberAndDate"
                      value={formData.chargeMemoNumberAndDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ChargesMemoNumber
                    </label>
                    <input
                      type="text"
                      name="chargesMemoNumber"
                      value={formData.chargesMemoNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="chargesDate"
                      value={formData.chargesDate}
                      onChange={handleChange}
                      max={today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.chargesIssued === 'no' && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="chargesIssuedRemarks"
                  value={formData.chargesIssuedRemarks}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter remarks..."
                />
              </div>
            )}

            {formData.chargesIssued === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endorcement date
                </label>
                <input
                  type="date"
                  name="endorcementDate"
                  value={formData.endorcementDate}
                  onChange={handleChange}
                  max={today}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* WSD Section - Only show if charges issued is yes */}
        {formData.chargesIssued === 'yes' && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Served Copy/Written Statement of Defence (WSD)
          </h2>
          <div className="space-y-6">
            <YesNoButtons
              fieldName="wsdOrServedCopy"
              value={formData.wsdOrServedCopy}
              onChange={handleYesNoChange}
              label="Served copy / Written statement of defence(WSD)"
            />

            {formData.wsdOrServedCopy === 'yes' && (
              <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="wsdCheckbox"
                      checked={formData.wsdCheckbox}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">WSD</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="servedCopyCheckbox"
                      checked={formData.servedCopyCheckbox}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Served Copy</span>
                  </label>
                </div>

                {showWSDFurtherAction && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Further action taken
                    </label>
                    <select
                      name="furtherActionWSD"
                      value={formData.furtherActionWSD}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Action</option>
                      <option value="conclude">Conclude</option>
                      <option value="ioPoAppointment">IO&PO Appointment</option>
                      <option value="others">Others</option>
                    </select>

                    {formData.furtherActionWSD === 'conclude' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Conclusion (One paragraph)
                          </label>
                          <textarea
                            name="concludeText"
                            value={formData.concludeText}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Issued by
                            </label>
                            <input
                              type="text"
                              name="wsdIssuedBy"
                              value={formData.wsdIssuedBy}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number
                            </label>
                            <input
                              type="text"
                              name="wsdNumber"
                              value={formData.wsdNumber}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              name="wsdDate"
                              value={formData.wsdDate}
                              onChange={handleChange}
                              max={today}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.furtherActionWSD === 'others' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Please specify
                          </label>
                          <textarea
                            name="furtherActionWSDOthers"
                            value={formData.furtherActionWSDOthers}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter details..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Issued by
                            </label>
                            <input
                              type="text"
                              name="wsdIssuedBy"
                              value={formData.wsdIssuedBy}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number
                            </label>
                            <input
                              type="text"
                              name="wsdNumber"
                              value={formData.wsdNumber}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              name="wsdDate"
                              value={formData.wsdDate}
                              onChange={handleChange}
                              max={today}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.furtherActionWSD === 'ioPoAppointment' && (
                      <div className="mt-4 space-y-4 bg-blue-50 p-4 rounded-md">
                        {/* IO Appointment Section */}
                        <div className="space-y-4">
                          <YesNoButtons
                            fieldName="ioAppointment"
                            value={formData.ioAppointment}
                            onChange={handleYesNoChange}
                            label="IO Appointment"
                          />

                          {formData.ioAppointment === 'yes' && (
                            <div className="ml-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    IO-GO/Proceedings Number
                                  </label>
                                  <input
                                    type="text"
                                    name="ioGoProceedingsNumber"
                                    value={formData.ioGoProceedingsNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                  </label>
                                  <input
                                    type="date"
                                    name="ioAppointmentDate"
                                    value={formData.ioAppointmentDate}
                                    onChange={handleChange}
                                    max={today}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of the Inquiry Officer
                                  </label>
                                  <input
                                    type="text"
                                    name="ioAppointmentIOName"
                                    value={formData.ioAppointmentIOName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Designation
                                  </label>
                                  <input
                                    type="text"
                                    name="ioAppointmentIODesignation"
                                    value={formData.ioAppointmentIODesignation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* PO Appointment Section */}
                        <div className="space-y-4 border-t pt-4">
                          <YesNoButtons
                            fieldName="poAppointment"
                            value={formData.poAppointment}
                            onChange={handleYesNoChange}
                            label="PO Appointment"
                          />

                          {formData.poAppointment === 'yes' && (
                            <div className="ml-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    PO-GO/Proceedings Number
                                  </label>
                                  <input
                                    type="text"
                                    name="poGoProceedingsNumber"
                                    value={formData.poGoProceedingsNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                  </label>
                                  <input
                                    type="date"
                                    name="poAppointmentDate"
                                    value={formData.poAppointmentDate}
                                    onChange={handleChange}
                                    max={today}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of the Inquiry Officer
                                  </label>
                                  <input
                                    type="text"
                                    name="poAppointmentIOName"
                                    value={formData.poAppointmentIOName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Designation
                                  </label>
                                  <input
                                    type="text"
                                    name="poAppointmentIODesignation"
                                    value={formData.poAppointmentIODesignation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Inquiry Report Section - Only show if charges issued is yes, WSD is yes, and WSD further action is not conclude/others */}
        {formData.chargesIssued === 'yes' && formData.wsdOrServedCopy === 'yes' && formData.furtherActionWSD !== 'conclude' && formData.furtherActionWSD !== 'others' && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Inquiry Officer Report
          </h2>
          <div className="space-y-6">
            <YesNoButtons
              fieldName="inquiryReportSubmitted"
              value={formData.inquiryReportSubmitted}
              onChange={handleYesNoChange}
              label="Whether inquiry Officer report submitted or not"
            />

            {formData.inquiryReportSubmitted === 'yes' && (
              <div className="ml-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inquiry report number
                    </label>
                    <input
                      type="text"
                      name="inquiryReportNumber"
                      value={formData.inquiryReportNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="inquiryReportDate"
                      value={formData.inquiryReportDate}
                      onChange={handleChange}
                      max={today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="inquiryReportName"
                      value={formData.inquiryReportName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Further Action Taken
                  </label>
                  <select
                    name="furtherActionInquiry"
                    value={formData.furtherActionInquiry}
                    onChange={handleChange}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Action</option>
                    <option value="agreed">Agreed with Inquiry report</option>
                    <option value="disagreed">DisAgreed with Inquiry Report</option>
                  </select>
                </div>

                {formData.furtherActionInquiry === 'disagreed' && (
                  <div className="ml-0 bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          If Disagreed
                        </label>
                        <select
                          name="inquiryDisagreedAction"
                          value={formData.inquiryDisagreedAction}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select Option</option>
                          <option value="remitted">Remitted back to same IO</option>
                          <option value="appointment">Appointment Of Another IO</option>
                          <option value="communication">Communication</option>
                        </select>
                      </div>

                      {formData.inquiryDisagreedAction === 'remitted' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number
                            </label>
                            <input
                              type="text"
                              name="inquiryRemittedNumber"
                              value={formData.inquiryRemittedNumber}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              name="inquiryRemittedDate"
                              value={formData.inquiryRemittedDate}
                              onChange={handleChange}
                              max={today}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </>
                      )}

                      {formData.inquiryDisagreedAction === 'appointment' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Proceeding Number
                            </label>
                            <input
                              type="text"
                              name="inquiryAppointmentProceedingNumber"
                              value={formData.inquiryAppointmentProceedingNumber}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name Of The IO
                            </label>
                            <input
                              type="text"
                              name="inquiryAppointmentIOName"
                              value={formData.inquiryAppointmentIOName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              name="inquiryAppointmentIODate"
                              value={formData.inquiryAppointmentIODate}
                              onChange={handleChange}
                              max={today}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </>
                      )}

                      {formData.inquiryDisagreedAction === 'communication' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Endorsement date
                          </label>
                          <input
                            type="date"
                            name="inquiryCommunicationEndorsementDate"
                            value={formData.inquiryCommunicationEndorsementDate}
                            onChange={handleChange}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* WR Section - Only show if charges issued is yes, WSD is yes, inquiry report submitted is yes, WSD further action is not conclude/others, and further action inquiry is agreed or (disagreed with communication) */}
        {formData.chargesIssued === 'yes' && formData.wsdOrServedCopy === 'yes' && formData.inquiryReportSubmitted === 'yes' && formData.furtherActionWSD !== 'conclude' && formData.furtherActionWSD !== 'others' && (formData.furtherActionInquiry === 'agreed' || (formData.furtherActionInquiry === 'disagreed' && formData.inquiryDisagreedAction === 'communication')) && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Served copy / Written Representation(WR)
          </h2>
          <div className="space-y-6">
            <YesNoButtons
              fieldName="wrOrServedCopy"
              value={formData.wrOrServedCopy}
              onChange={handleYesNoChange}
              label="Served copy / Written Representation(WR)"
            />

            {formData.wrOrServedCopy === 'yes' && (
              <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="wrCheckbox"
                      checked={formData.wrCheckbox}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">WR</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="wrServedCopyCheckbox"
                      checked={formData.wrServedCopyCheckbox}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Served Copy</span>
                  </label>
                </div>

                {showWRFurtherAction && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Further action taken
                    </label>
                    <select
                      name="furtherActionWR"
                      value={formData.furtherActionWR}
                      onChange={handleChange}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Action</option>
                      <option value="punishment">Punishment</option>
                      <option value="dropped">Dropped</option>
                      <option value="warn">Warn</option>
                      <option value="others">Others</option>
                    </select>

                    {formData.furtherActionWR && formData.furtherActionWR !== 'others' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issued By
                        </label>
                        <textarea
                          name="wrIssuedBy"
                          value={formData.wrIssuedBy}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter issued by details..."
                        />
                      </div>
                    )}

                    {formData.furtherActionWR === 'others' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <textarea
                          name="furtherActionWRRemarks"
                          value={formData.furtherActionWRRemarks}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter remarks..."
                        />
                      </div>
                    )}

                    {formData.furtherActionWR && formData.furtherActionWR !== 'others' && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number
                          </label>
                          <input
                            type="text"
                            name="punishmentNumber"
                            value={formData.punishmentNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            name="punishmentDate"
                            value={formData.punishmentDate}
                            onChange={handleChange}
                            max={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Remarks Section - Always visible */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Additional Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks if any
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter any additional remarks..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6 flex justify-end gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isFormDisabled}
            className={`px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isSubmitting || isFormDisabled
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Next
          </button>
        </div>
        </div>
      </fieldset>

      {/* Submitted Employees Table */}
      {submittedEmployees.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6" data-submitted-employees-table>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Submitted Employees ({submittedEmployees.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-blue-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    ULB
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {submittedEmployees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-blue-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {employee.employeeId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {employee.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {employee.designationWhenChargesIssued || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border border-gray-300">
                      {employee.nameOfULB || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium border border-gray-300">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewEmployee(employee);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEmployee(employee);
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEmployee(employee);
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Final Submit Button - Centered at Bottom */}
      {submittedEmployees.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting || isFinalSubmitted}
            className={`px-8 py-3 rounded-md font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isSubmitting || isFinalSubmitted
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      {/* View Employee Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setViewingEmployee(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Employee Details</h3>
                  <button
                    onClick={() => setViewingEmployee(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {Object.entries(viewingEmployee).filter(([key]) => 
                      !['id', 'timestamp'].includes(key)
                    ).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <p className="text-gray-900 mt-1 break-words">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || '-')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={cancelDelete}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Are you sure you want to delete?
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will permanently remove the employee "{deleteConfirmEmployee.name || deleteConfirmEmployee.employeeId}" from the list. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DisciplinaryCaseForm;

