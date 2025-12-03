import React, { useState } from 'react';

const DisciplinaryCaseForm = ({ onSubmit, initialData = {}, isEdit = false, onCancel, onFormSubmitted }) => {
  const [formData, setFormData] = useState({
    fileNumber: initialData.fileNumber || '',
    eOfficeNumber: initialData.eOfficeNumber || '',
    employeeId: initialData.employeeId || '',
    name: initialData.name || '',
    designationWhenChargesIssued: initialData.designationWhenChargesIssued || '',
    nameOfULB: initialData.nameOfULB || '',
    caseType: initialData.caseType || 'Trap Case',
    
    // Trap case fields
    employeeSuspended: initialData.employeeSuspended || '',
    suspensionProceedingNumber: initialData.suspensionProceedingNumber || '',
    suspensionDate: initialData.suspensionDate || '',
    employeeReinitiated: initialData.employeeReinitiated || '',
    reinitiationProceedingNumber: initialData.reinitiationProceedingNumber || '',
    reinitiationDate: initialData.reinitiationDate || '',
    criminalCaseFiled: initialData.criminalCaseFiled || '',
    criminalCaseNumber: initialData.criminalCaseNumber || '',
    criminalCaseDate: initialData.criminalCaseDate || '',
    
    // Prosecution and charges
    prosecutionSanctioned: initialData.prosecutionSanctioned || '',
    prosecutionIssuedBy: initialData.prosecutionIssuedBy || '',
    chargesIssued: initialData.chargesIssued || '',
    chargeMemoNumberAndDate: initialData.chargeMemoNumberAndDate || '',
    endorcementDate: initialData.endorcementDate || '',
    
    // WSD fields
    wsdOrServedCopy: initialData.wsdOrServedCopy || '',
    wsdCheckbox: initialData.wsdCheckbox || false,
    servedCopyCheckbox: initialData.servedCopyCheckbox || false,
    furtherActionWSD: initialData.furtherActionWSD || '',
    concludeText: initialData.concludeText || '',
    ioPoAppointment: initialData.ioPoAppointment || '',
    goProceedingsNumber: initialData.goProceedingsNumber || '',
    ioPoDate: initialData.ioPoDate || '',
    nameOfIO: initialData.nameOfIO || '',
    designationOfIO: initialData.designationOfIO || '',
    nameOfPO: initialData.nameOfPO || '',
    designationOfPO: initialData.designationOfPO || '',
    
    // Inquiry report fields
    inquiryReportSubmitted: initialData.inquiryReportSubmitted || '',
    inquiryReportNumber: initialData.inquiryReportNumber || '',
    inquiryReportCommunicated: initialData.inquiryReportCommunicated || '',
    inquiryEndorcementDate: initialData.inquiryEndorcementDate || '',
    
    // WR fields
    wrOrServedCopy: initialData.wrOrServedCopy || '',
    wrCheckbox: initialData.wrCheckbox || false,
    wrServedCopyCheckbox: initialData.wrServedCopyCheckbox || false,
    furtherActionWR: initialData.furtherActionWR || '',
    punishmentNumber: initialData.punishmentNumber || '',
    punishmentDate: initialData.punishmentDate || '',
    
    // Remarks
    remarks: initialData.remarks || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    'RDMA Office 1',
    'RDMA Office 2',
    'RDMA Office 3',
    'RDMA Office 4',
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
      employeeSuspended: ['suspensionProceedingNumber', 'suspensionDate', 'employeeReinitiated', 'reinitiationProceedingNumber', 'reinitiationDate'],
      employeeReinitiated: ['reinitiationProceedingNumber', 'reinitiationDate'],
      criminalCaseFiled: ['criminalCaseNumber', 'criminalCaseDate'],
      prosecutionSanctioned: ['prosecutionIssuedBy'],
      chargesIssued: ['chargeMemoNumberAndDate'],
      wsdOrServedCopy: ['wsdCheckbox', 'servedCopyCheckbox', 'furtherActionWSD', 'concludeText', 'ioPoAppointment'],
      ioPoAppointment: ['goProceedingsNumber', 'ioPoDate', 'nameOfIO', 'designationOfIO', 'nameOfPO', 'designationOfPO'],
      inquiryReportSubmitted: ['inquiryReportNumber'],
      inquiryReportCommunicated: ['inquiryEndorcementDate'],
      wrOrServedCopy: ['wrCheckbox', 'wrServedCopyCheckbox', 'furtherActionWR', 'punishmentNumber', 'punishmentDate']
    };
    return dependencyMap[fieldName] || [];
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.designationWhenChargesIssued) {
      newErrors.designationWhenChargesIssued = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
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
    
    if (!onSubmit) {
      console.error('onSubmit prop is not provided');
      alert('Form submission handler is not configured');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Calling onSubmit with form data');
      await onSubmit(formData);
      console.log('onSubmit completed successfully');
      setIsSubmitted(true);
      if (onFormSubmitted) {
        onFormSubmitted(true);
      }
      alert('Case submitted successfully!');
    } catch (error) {
      // Error is handled in parent component
      console.error('Form submission error:', error);
      // Re-throw to let parent handle it
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEmployee = () => {
    // Reset employee-specific fields while keeping file number and e-office number
    setFormData(prev => ({
      ...prev,
      employeeId: '',
      name: '',
      designationWhenChargesIssued: '',
      // Keep file number and e-office number unchanged
    }));
    setErrors({});
  };

  // Yes/No button component
  const YesNoButtons = ({ fieldName, value, onChange, label, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange(fieldName, 'yes')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            value === 'yes'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(fieldName, 'no')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            value === 'no'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );

  // Check if trap case specific fields should be shown
  const isTrapCase = formData.caseType === 'Trap Case';

  // Check if WSD further action should be shown (if WSD checkbox is selected, or both checkboxes are selected)
  const showWSDFurtherAction = formData.wsdOrServedCopy === 'yes' && formData.wsdCheckbox;

  // Check if WR further action should be shown (if WR checkbox is selected, or both checkboxes are selected)
  const showWRFurtherAction = formData.wrOrServedCopy === 'yes' && formData.wrCheckbox;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-6">
        {/* Add Employee Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAddEmployee}
            disabled={!isSubmitted}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isSubmitted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Employee
          </button>
        </div>

        {/* Basic Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Number
              </label>
              <input
                type="text"
                name="fileNumber"
                value={formData.fileNumber}
                onChange={handleChange}
                disabled={isSubmitted}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
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
                disabled={isSubmitted}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
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

        {/* Trap Case Section */}
        {isTrapCase && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Trap Case Details
            </h2>
            <div className="space-y-6">
              <YesNoButtons
                fieldName="employeeSuspended"
                value={formData.employeeSuspended}
                onChange={handleYesNoChange}
                label="Employee suspended or not"
              />

              {formData.employeeSuspended === 'yes' && (
                <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prosecution and Charges Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
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
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issued by
                </label>
                <textarea
                  name="prosecutionIssuedBy"
                  value={formData.prosecutionIssuedBy}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <YesNoButtons
              fieldName="chargesIssued"
              value={formData.chargesIssued}
              onChange={handleYesNoChange}
              label="Charges issued"
            />

            {formData.chargesIssued === 'yes' && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charge memo number & date
                </label>
                <textarea
                  name="chargeMemoNumberAndDate"
                  value={formData.chargeMemoNumberAndDate}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endorcement date
              </label>
              <input
                type="date"
                name="endorcementDate"
                value={formData.endorcementDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* WSD Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Written Statement of Defence (WSD)
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
                    </select>

                    {formData.furtherActionWSD === 'conclude' && (
                      <div className="mt-4">
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
                    )}

                    {formData.furtherActionWSD === 'ioPoAppointment' && (
                      <div className="mt-4 space-y-4 bg-blue-50 p-4 rounded-md">
                        <YesNoButtons
                          fieldName="ioPoAppointment"
                          value={formData.ioPoAppointment}
                          onChange={handleYesNoChange}
                          label="IO&PO Appointment"
                        />

                        {formData.ioPoAppointment === 'yes' && (
                          <div className="ml-6 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                GO/Proceedings number
                              </label>
                              <textarea
                                name="goProceedingsNumber"
                                value={formData.goProceedingsNumber}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                name="ioPoDate"
                                value={formData.ioPoDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name of the IO <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  name="nameOfIO"
                                  value={formData.nameOfIO}
                                  onChange={handleChange}
                                  rows="2"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Designation of IO
                                </label>
                                <textarea
                                  name="designationOfIO"
                                  value={formData.designationOfIO}
                                  onChange={handleChange}
                                  rows="2"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name of the PO <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  name="nameOfPO"
                                  value={formData.nameOfPO}
                                  onChange={handleChange}
                                  rows="2"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Designation of PO
                                </label>
                                <textarea
                                  name="designationOfPO"
                                  value={formData.designationOfPO}
                                  onChange={handleChange}
                                  rows="2"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Report Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
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
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry report number
                </label>
                <textarea
                  name="inquiryReportNumber"
                  value={formData.inquiryReportNumber}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <YesNoButtons
              fieldName="inquiryReportCommunicated"
              value={formData.inquiryReportCommunicated}
              onChange={handleYesNoChange}
              label="Inquiry report communicated or not"
            />

            {formData.inquiryReportCommunicated === 'yes' && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endorcement date
                </label>
                <input
                  type="date"
                  name="inquiryEndorcementDate"
                  value={formData.inquiryEndorcementDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* WR Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Written Representation (WR)
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Action</option>
                      <option value="punishment">Punishment</option>
                      <option value="dropped">Dropped</option>
                      <option value="warn">Warn</option>
                    </select>

                    {formData.furtherActionWR && (
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

        {/* Remarks Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
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
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DisciplinaryCaseForm;

