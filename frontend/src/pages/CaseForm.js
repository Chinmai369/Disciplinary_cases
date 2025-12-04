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
      setSubCategoryConfirmed(false); // Reset confirmation when subcategory changes
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
      const mergedData = {
        ...disciplinaryFormData,
        categoryOfCase: formData.categoryOfCase,
        subCategoryOfCase: formData.subCategoryOfCase,
        // Map name to employeeName for backend compatibility
        employeeName: disciplinaryFormData.name || disciplinaryFormData.employeeName,
        // Set default values for required backend fields if not present
        incidentDate: disciplinaryFormData.incidentDate || new Date().toISOString().split('T')[0],
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
  const showSubCategoryWithOk = !isEdit && formData.categoryOfCase && formData.subCategoryOfCase && !subCategoryConfirmed && !isSubmittingFinal;
  const showFullForm = !isSubmittingFinal && (isEdit || (formData.categoryOfCase && formData.subCategoryOfCase && subCategoryConfirmed));

  const handleOkClick = () => {
    if (formData.subCategoryOfCase) {
      setSubCategoryConfirmed(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Case' : 'Create New Case'}
      </h1>

      {showCategorySelection && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category of Case</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please select the category of case
            </label>
              <select
                name="categoryOfCase"
                value={formData.categoryOfCase}
                onChange={handleChange}
                disabled={isFormSubmitted}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base ${
                  isFormSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Category Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category of Case
              </label>
              <select
                name="categoryOfCase"
                value={formData.categoryOfCase}
                onChange={handleChange}
                disabled={isFormSubmitted}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-white ${
                  isFormSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Category</option>
                <option value="Department">Department</option>
                <option value="ACB">ACB</option>
                <option value="Vigilance and Enforcement">Vigilance and Enforcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category of Case
              </label>
              <div className="space-y-2">
                {getSubCategories().map((subCategory) => (
                  <label
                    key={subCategory}
                    className={`flex items-center p-3 border border-gray-300 rounded-md transition-colors ${
                      isFormSubmitted
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subCategoryOfCase"
                      value={subCategory}
                      checked={formData.subCategoryOfCase === subCategory}
                      onChange={handleChange}
                      disabled={isFormSubmitted}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{subCategory}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubCategoryWithOk && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Category Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category of Case
              </label>
              <select
                name="categoryOfCase"
                value={formData.categoryOfCase}
                onChange={handleChange}
                disabled={isFormSubmitted}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-white ${
                  isFormSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Category</option>
                <option value="Department">Department</option>
                <option value="ACB">ACB</option>
                <option value="Vigilance and Enforcement">Vigilance and Enforcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category of Case
              </label>
              <div className="space-y-2 mb-4">
                {getSubCategories().map((subCategory) => (
                  <label
                    key={subCategory}
                    className={`flex items-center p-3 border border-gray-300 rounded-md transition-colors ${
                      isFormSubmitted
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subCategoryOfCase"
                      value={subCategory}
                      checked={formData.subCategoryOfCase === subCategory}
                      onChange={handleChange}
                      disabled={isFormSubmitted}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{subCategory}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleOkClick}
                  disabled={isFormSubmitted}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isFormSubmitted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFullForm && (
        <>
          {/* Show category info if it's a new case */}
          {!isEdit && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{formData.categoryOfCase}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sub Category</p>
                  <p className="font-medium text-gray-900">{formData.subCategoryOfCase}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, categoryOfCase: '', subCategoryOfCase: '' }));
                    setSubCategoryConfirmed(false);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
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
                    const mergedData = {
                      ...employee, // Includes all form fields: fileNumber, eOfficeNumber, name, employeeId, etc.
                      categoryOfCase: formData.categoryOfCase || employee.categoryOfCase || '',
                      subCategoryOfCase: formData.subCategoryOfCase || employee.subCategoryOfCase || '',
                      employeeName: employee.name || employee.employeeName,
                      name: employee.name || employee.employeeName,
                      incidentDate: employee.incidentDate || new Date().toISOString().split('T')[0],
                      description: employee.description || employee.remarks || 'Disciplinary case',
                      // Ensure fileNumber and eOfficeNumber are preserved from employee data or preserved data
                      fileNumber: employee.fileNumber || preservedFileData.fileNumber || '',
                      eOfficeNumber: employee.eOfficeNumber || preservedFileData.eOfficeNumber || '',
                    };
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

