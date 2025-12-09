import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCaseById, createCase, updateCase } from '../services/api';
import DisciplinaryCaseForm from '../components/DisciplinaryCaseForm';

const CaseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeeEmail: '',
    department: '',
    position: '',
    categoryOfCase: '',
    subCategoryOfCase: '',
    incidentDate: '',
    reportedDate: new Date().toISOString().split('T')[0],
    description: '',
    severity: 'Medium',
    status: 'Pending',
    actionTaken: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subCategoryConfirmed, setSubCategoryConfirmed] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [preservedFileData, setPreservedFileData] = useState({ fileNumber: '', eOfficeNumber: '' });
  const [formResetKey, setFormResetKey] = useState(0);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    if (isEdit) {
      fetchCase();
    }
  }, [id]);

  // Auto-close success modal after 5 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Automatically enable form when both category and subcategory are selected
  useEffect(() => {
    if (!isEdit && formData.categoryOfCase && formData.subCategoryOfCase) {
      setSubCategoryConfirmed(true);
    }
  }, [formData.categoryOfCase, formData.subCategoryOfCase]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await getCaseById(id);
      const caseData = response.data;
      setFormData({
        ...caseData,
        incidentDate: caseData.incidentDate.split('T')[0],
        reportedDate: caseData.reportedDate
          ? caseData.reportedDate.split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching case:', error);
      alert('Failed to load case');
      navigate('/cases');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If category changes, reset subcategory and confirmation
    if (name === 'categoryOfCase') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subCategoryOfCase: '',
      }));
      setSubCategoryConfirmed(false);
    } else if (name === 'subCategoryOfCase') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Confirmation will be set automatically by useEffect when both are selected
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Subcategory options based on category
  const getSubCategories = () => {
    const subCategoriesMap = {
      'Department': [
        'Misappropriation',
        'Procedural violations'
      ],
      'ACB': [
        'Trap Case',
        'Disproportionate Assets',
        'Surprise Check'
      ],
      'Vigilance and Enforcement': [
        'Vigilance report',
        'Alert note',
        'Appraisal note'
      ]
    };
    return subCategoriesMap[formData.categoryOfCase] || [];
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee Name is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await updateCase(id, formData);
      } else {
        await createCase(formData);
      }
      navigate('/cases');
    } catch (error) {
      console.error('Error saving case:', error);
      alert('Failed to save case');
    } finally {
      setLoading(false);
    }
  };

  const handleDisciplinaryFormSubmit = async (disciplinaryFormData) => {
    try {
      setLoading(true);
      // Merge disciplinary form data with category/subcategory data
      // Map form fields to backend expected format
      const employeeName = disciplinaryFormData.name || disciplinaryFormData.employeeName || '';
      // Send empty string for employeeId if not provided (backend may accept empty string but not null)
      const employeeId = disciplinaryFormData.employeeId && disciplinaryFormData.employeeId.trim() !== '' 
        ? disciplinaryFormData.employeeId.trim() 
        : '';
      
      const mergedData = {
        ...disciplinaryFormData,
        categoryOfCase: formData.categoryOfCase,
        subCategoryOfCase: formData.subCategoryOfCase,
        // Map name to employeeName for backend compatibility
        employeeName: employeeName,
        name: employeeName,
        employeeId: employeeId, // Send null if empty, otherwise send the trimmed value
        // Set default values for required backend fields if not present
        incidentDate: disciplinaryFormData.incidentDate || disciplinaryFormData.dateOfIncident || new Date().toISOString().split('T')[0],
        description: disciplinaryFormData.description || disciplinaryFormData.remarks || 'Disciplinary case',
      };

      if (isEdit) {
        await updateCase(id, mergedData);
        navigate('/cases');
      } else {
        if (!isFormSubmitted) {
          // First submission - create the case
          await createCase(mergedData);
          // Preserve file number and e-office number for future employee additions
          setPreservedFileData({
            fileNumber: disciplinaryFormData.fileNumber || '',
            eOfficeNumber: disciplinaryFormData.eOfficeNumber || ''
          });
          setIsFormSubmitted(true);
          // Don't navigate - stay on form to allow adding employees
        } else {
          // Subsequent submissions - create new case entry for additional employees
          await createCase(mergedData);
          // Stay on form to allow adding more employees
        }
      }
    } catch (error) {
      console.error('Error saving case:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to save case: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // For new cases, show only category selection first
  // Hide form if final submission is in progress or completed
  const showCategorySelection = !isEdit && (!formData.categoryOfCase || isSubmittingFinal);
  const showBothDropdowns = !isEdit && formData.categoryOfCase && !formData.subCategoryOfCase && !isSubmittingFinal;
  const showFullForm = !isSubmittingFinal && (isEdit || (formData.categoryOfCase && formData.subCategoryOfCase));

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-md">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Case' : 'Create New Case'}
          </h1>
          <p className="text-gray-600 text-sm mt-0.5">
            {isEdit ? 'Update case information' : 'Add a new disciplinary case to the system'}
          </p>
        </div>
      </div>

      {showCategorySelection && (
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Category of Case</h2>
          </div>
          <div className="w-full max-w-xs">
            <select
              name="categoryOfCase"
              value={formData.categoryOfCase}
              onChange={handleChange}
              disabled={isFormSubmitted}
              className={`w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                isFormSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
              }`}
            >
              <option value="">Select Category</option>
              <option value="Department">Department</option>
              <option value="ACB">ACB</option>
              <option value="Vigilance and Enforcement">Vigilance and Enforcement</option>
            </select>
          </div>
        </div>
      )}

      {showBothDropdowns && (
        <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <label className="block text-sm font-semibold text-gray-900">
                  Category of Case
                </label>
              </div>
              <select
                name="categoryOfCase"
                value={formData.categoryOfCase}
                onChange={handleChange}
                disabled={isFormSubmitted}
                className={`w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                  isFormSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'
                }`}
              >
                <option value="">Select Category</option>
                <option value="Department">Department</option>
                <option value="ACB">ACB</option>
                <option value="Vigilance and Enforcement">Vigilance and Enforcement</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <label className="block text-sm font-semibold text-gray-900">
                  Sub Category of Case
                </label>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {getSubCategories().map((subCategory) => (
                  <label
                    key={subCategory}
                    className={`flex items-center px-5 py-3 min-w-[160px] border-2 rounded-lg transition-all ${
                      formData.subCategoryOfCase === subCategory
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    } ${
                      isFormSubmitted
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subCategoryOfCase"
                      value={subCategory}
                      checked={formData.subCategoryOfCase === subCategory}
                      onChange={handleChange}
                      disabled={isFormSubmitted}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className={`ml-3 text-sm font-medium whitespace-nowrap ${
                      formData.subCategoryOfCase === subCategory ? 'text-purple-700' : 'text-gray-700'
                    }`}>{subCategory}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
      )}

      {showFullForm && (
        <>
          {/* Show category info if it's a new case */}
          {!isEdit && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4 mb-6 shadow-sm max-w-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Category</p>
                      <p className="text-sm font-bold text-gray-900">{formData.categoryOfCase}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-blue-300"></div>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500 rounded-lg p-1.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Sub Category</p>
                      <p className="text-sm font-bold text-gray-900">{formData.subCategoryOfCase}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, categoryOfCase: '', subCategoryOfCase: '' }));
                    setSubCategoryConfirmed(false);
                  }}
                  className="bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg border-2 border-blue-300 hover:border-blue-400 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 text-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Show DisciplinaryCaseForm for new cases, or show old form for edit mode */}
          {isEdit ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Employee Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.employeeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.employeeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.employeeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="employeeEmail"
                    value={formData.employeeEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                </div>
              </div>

              {/* Incident Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Incident Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.incidentDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.incidentDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reported Date
                  </label>
                  <input
                    type="date"
                    name="reportedDate"
                    value={formData.reportedDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Action Taken */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken
                </label>
                <textarea
                  name="actionTaken"
                  value={formData.actionTaken}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/cases')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Case' : 'Create Case'}
                </button>
              </div>
            </form>
          ) : (
            <DisciplinaryCaseForm
              key={`form-${formData.categoryOfCase}-${formData.subCategoryOfCase}-${formResetKey}`}
              onSubmit={handleDisciplinaryFormSubmit}
              initialData={{
                caseType: formData.subCategoryOfCase || 'Trap Case',
                categoryOfCase: formData.categoryOfCase,
                subCategoryOfCase: formData.subCategoryOfCase,
                // Preserve file number and e-office number after first submission
                fileNumber: isFormSubmitted ? preservedFileData.fileNumber : undefined,
                eOfficeNumber: isFormSubmitted ? preservedFileData.eOfficeNumber : undefined,
              }}
              isEdit={isEdit}
              onCancel={() => navigate('/cases')}
              onFormSubmitted={(submitted) => setIsFormSubmitted(submitted)}
              isFormSubmitted={isFormSubmitted}
              onFinalSubmit={async (submittedEmployees) => {
                // Submit all employees and reset form to show category selection
                try {
                  setIsSubmittingFinal(true); // Hide form immediately
                  setLoading(true);
                  for (const employee of submittedEmployees) {
                    // Build merged data, handling optional employeeId
                    const employeeName = employee.name || employee.employeeName || '';
                    // Send empty string for employeeId if not provided
                    const employeeId = employee.employeeId && employee.employeeId.trim() !== '' 
                      ? employee.employeeId.trim() 
                      : '';
                    
                    const mergedData = {
                      ...employee, // Includes all form fields: fileNumber, eOfficeNumber, name, employeeId, etc.
                      categoryOfCase: formData.categoryOfCase || employee.categoryOfCase || '',
                      subCategoryOfCase: formData.subCategoryOfCase || employee.subCategoryOfCase || '',
                      employeeName: employeeName,
                      name: employeeName,
                      employeeId: employeeId, // Empty string if not provided
                      incidentDate: employee.incidentDate || employee.dateOfIncident || new Date().toISOString().split('T')[0],
                      description: employee.description || employee.remarks || 'Disciplinary case',
                      // Ensure fileNumber and eOfficeNumber are preserved from employee data or preserved data
                      fileNumber: employee.fileNumber || preservedFileData.fileNumber || '',
                      eOfficeNumber: employee.eOfficeNumber || preservedFileData.eOfficeNumber || '',
                    };
                    
                    // Debug logging
                    console.log('Submitting case data:', {
                      employeeName,
                      employeeId: employeeId || '(empty)',
                      hasName: !!employeeName,
                      hasEmployeeId: !!employeeId
                    });
                    
                    await createCase(mergedData);
                  }
                  // Show success modal
                  setSubmittedCount(submittedEmployees.length);
                  setShowSuccessModal(true);
                  
                  // Reset form state to show category selection section again
                  setFormData((prev) => ({
                    ...prev,
                    categoryOfCase: '',
                    subCategoryOfCase: '',
                  }));
                  setSubCategoryConfirmed(false);
                  setIsFormSubmitted(false);
                  setPreservedFileData({ fileNumber: '', eOfficeNumber: '' });
                  setFormResetKey((prev) => prev + 1); // Force component remount
                  setIsSubmittingFinal(false); // Reset flag - category selection will show naturally
                } catch (error) {
                  console.error('Error submitting cases:', error);
                  alert(`Failed to submit cases: ${error.response?.data?.message || error.message || 'Unknown error'}`);
                  setIsSubmittingFinal(false); // Re-show form if submission fails
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowSuccessModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Success!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        All {submittedCount} case{submittedCount !== 1 ? 's' : ''} {submittedCount !== 1 ? 'have' : 'has'} been submitted successfully!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseForm;

