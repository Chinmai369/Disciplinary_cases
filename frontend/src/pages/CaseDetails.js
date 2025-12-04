import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCaseById, deleteCase } from '../services/api';

const CaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await getCaseById(id);
      // Handle API response structure: response.data.data or response.data
      const caseDataFromAPI = response.data?.data || response.data;
      setCaseData(caseDataFromAPI);
    } catch (error) {
      console.error('Error fetching case:', error);
      alert('Failed to load case');
      navigate('/cases');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteCase(id);
        navigate('/cases');
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case');
      }
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Case not found</p>
        <Link to="/cases" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Case Details</h1>
        <div className="flex space-x-2">
          <Link
            to={`/cases/${id}/edit`}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <Link
            to="/cases"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {caseData.employeeName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">ID: {caseData.employeeId}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getSeverityColor(
                  caseData.severity
                )}`}
              >
                {caseData.severity}
              </span>
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                  caseData.status
                )}`}
              >
                {caseData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section - Shows only disciplinary case form fields */}
        <div className="px-6 py-6">
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {/* Define all form fields from DisciplinaryCaseForm */}
              {[
                // Basic fields
                { key: 'fileNumber', label: 'File Number' },
                { key: 'eOfficeNumber', label: 'E-Office Number' },
                { key: 'employeeId', label: 'Employee ID' },
                { key: 'name', label: 'Name', altKey: 'employeeName' },
                { key: 'designationWhenChargesIssued', label: 'Designation When Charges Issued' },
                { key: 'nameOfULB', label: 'Name of ULB' },
                { key: 'caseType', label: 'Case Type' },
                { key: 'categoryOfCase', label: 'Category of Case' },
                { key: 'subCategoryOfCase', label: 'Sub Category of Case' },
                
                // Trap case fields
                { key: 'employeeSuspended', label: 'Employee Suspended' },
                { key: 'suspensionProceedingNumber', label: 'Suspension Proceeding Number' },
                { key: 'suspensionDate', label: 'Suspension Date', isDate: true },
                { key: 'employeeReinitiated', label: 'Employee Re-initiated' },
                { key: 'reinitiationProceedingNumber', label: 'Re-initiation Proceeding Number' },
                { key: 'reinitiationDate', label: 'Re-initiation Date', isDate: true },
                { key: 'criminalCaseFiled', label: 'Criminal Case Filed' },
                { key: 'criminalCaseNumber', label: 'Criminal Case Number' },
                { key: 'criminalCaseDate', label: 'Criminal Case Date', isDate: true },
                
                // Prosecution and charges
                { key: 'prosecutionSanctioned', label: 'Prosecution Sanctioned' },
                { key: 'prosecutionIssuedBy', label: 'Prosecution Issued By' },
                { key: 'chargesIssued', label: 'Charges Issued' },
                { key: 'chargeMemoNumberAndDate', label: 'Charge Memo Number & Date' },
                { key: 'endorcementDate', label: 'Endorcement Date', isDate: true },
                
                // WSD fields
                { key: 'wsdOrServedCopy', label: 'WSD or Served Copy' },
                { key: 'wsdCheckbox', label: 'WSD', isBoolean: true },
                { key: 'servedCopyCheckbox', label: 'Served Copy', isBoolean: true },
                { key: 'furtherActionWSD', label: 'Further Action (WSD)' },
                { key: 'concludeText', label: 'Conclude Text' },
                { key: 'ioPoAppointment', label: 'IO & PO Appointment' },
                { key: 'goProceedingsNumber', label: 'GO/Proceedings Number' },
                { key: 'ioPoDate', label: 'IO & PO Date', isDate: true },
                { key: 'nameOfIO', label: 'Name of IO' },
                { key: 'designationOfIO', label: 'Designation of IO' },
                { key: 'nameOfPO', label: 'Name of PO' },
                { key: 'designationOfPO', label: 'Designation of PO' },
                
                // Inquiry report fields
                { key: 'inquiryReportSubmitted', label: 'Inquiry Report Submitted' },
                { key: 'inquiryReportNumber', label: 'Inquiry Report Number' },
                { key: 'inquiryReportCommunicated', label: 'Inquiry Report Communicated' },
                { key: 'inquiryEndorcementDate', label: 'Inquiry Endorcement Date', isDate: true },
                
                // WR fields
                { key: 'wrOrServedCopy', label: 'WR or Served Copy' },
                { key: 'wrCheckbox', label: 'WR', isBoolean: true },
                { key: 'wrServedCopyCheckbox', label: 'WR Served Copy', isBoolean: true },
                { key: 'furtherActionWR', label: 'Further Action (WR)' },
                { key: 'punishmentNumber', label: 'Punishment Number' },
                { key: 'punishmentDate', label: 'Punishment Date', isDate: true },
                
                // Remarks
                { key: 'remarks', label: 'Remarks' },
              ].map(({ key, label, altKey, isDate, isBoolean }) => {
                const value = caseData[key] !== undefined ? caseData[key] : (altKey && caseData[altKey] !== undefined ? caseData[altKey] : null);
                
                let displayValue;
                
                if (isBoolean) {
                  displayValue = value === true || value === 'yes' || value === 'Yes' ? 'Yes' : 'No';
                } else if (isDate && value) {
                  try {
                    const date = new Date(value);
                    displayValue = isNaN(date.getTime()) ? value : date.toLocaleDateString();
                  } catch {
                    displayValue = value;
                  }
                } else if (value === null || value === undefined || value === '') {
                  displayValue = '-';
                } else {
                  displayValue = String(value);
                }
                
                return (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-medium capitalize block mb-1">
                      {label}:
                    </span>
                    <p className="text-gray-900 break-words">
                      {displayValue}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;

