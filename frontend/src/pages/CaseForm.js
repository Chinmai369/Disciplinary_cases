import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCaseById, createCase, updateCase } from '../services/api';

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

  useEffect(() => {
    if (isEdit) {
      fetchCase();
    }
  }, [id]);

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
    
    // If category changes, reset subcategory
    if (name === 'categoryOfCase') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subCategoryOfCase: '',
      }));
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

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // For new cases, show only category selection first
  const showCategorySelection = !isEdit && !formData.categoryOfCase;
  const showBothDropdowns = !isEdit && formData.categoryOfCase && !formData.subCategoryOfCase;
  const showFullForm = isEdit || (formData.categoryOfCase && formData.subCategoryOfCase);

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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-white"
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
              <select
                name="subCategoryOfCase"
                value={formData.subCategoryOfCase}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-base bg-white"
              >
                <option value="">Select Sub Category</option>
                {getSubCategories().map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {showFullForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Show category info if it's a new case */}
          {!isEdit && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
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
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          )}

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
      )}
    </div>
  );
};

export default CaseForm;

