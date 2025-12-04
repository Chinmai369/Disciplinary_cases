import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCases } from '../services/api';

const DashboardContent = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    closed: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCase, setViewingCase] = useState(null);
  const [editingCase, setEditingCase] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds to show new cases
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getCases();
      // Handle API response structure: axios wraps in response.data
      // Backend returns: { success: true, data: [...] }
      // So we need: response.data.data
      let cases = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        cases = response.data.data;
      } else if (Array.isArray(response.data)) {
        cases = response.data;
      }
      
      console.log('Dashboard: Fetched', cases.length, 'cases');
      if (cases.length > 0) {
        console.log('Dashboard: Sample case:', cases[0]);
      }
      
      setStats({
        total: cases.length,
        pending: cases.filter(c => c.status === 'Pending').length,
        underReview: cases.filter(c => c.status === 'Under Review').length,
        resolved: cases.filter(c => c.status === 'Resolved').length,
        closed: cases.filter(c => c.status === 'Closed').length,
      });

      // Get 5 most recent cases - sort by createdAt or updatedAt
      const sorted = [...cases].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });
      setRecentCases(sorted.slice(0, 5));
      
      console.log('Fetched cases:', cases.length, 'Recent cases:', sorted.slice(0, 5).length);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Set empty arrays on error to prevent display issues
      setRecentCases([]);
      setStats({
        total: 0,
        pending: 0,
        underReview: 0,
        resolved: 0,
        closed: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Cases', value: stats.total, color: 'bg-blue-500' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
    { label: 'Under Review', value: stats.underReview, color: 'bg-orange-500' },
    { label: 'Resolved', value: stats.resolved, color: 'bg-green-500' },
    { label: 'Closed', value: stats.closed, color: 'bg-gray-500' },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/cases/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Case</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={fetchData}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              title="Refresh data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link
              to="/cases"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No cases found. 
                    <Link to="/cases/new" className="text-primary-600 hover:text-primary-700 ml-1 font-medium">
                      Create your first case!
                    </Link>
                  </td>
                </tr>
              ) : (
                recentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {caseItem.employeeName || caseItem.name || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caseItem.employeeId || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.fileNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{caseItem.categoryOfCase || '-'}</div>
                      {caseItem.subCategoryOfCase && (
                        <div className="text-xs text-gray-400">{caseItem.subCategoryOfCase}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.incidentDate ? (
                        (() => {
                          try {
                            const date = new Date(caseItem.incidentDate);
                            return isNaN(date.getTime()) ? caseItem.incidentDate : date.toLocaleDateString();
                          } catch (e) {
                            return caseItem.incidentDate || '-';
                          }
                        })()
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {caseItem.severity ? (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                            caseItem.severity
                          )}`}
                        >
                          {caseItem.severity}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {caseItem.status ? (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            caseItem.status
                          )}`}
                        >
                          {caseItem.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center flex-shrink-0 whitespace-nowrap">
                        <button
                          onClick={() => {
                            console.log('Clicked View - Case item:', caseItem);
                            console.log('Case item keys:', Object.keys(caseItem));
                            setViewingCase(caseItem);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingCase(caseItem)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Case Modal - Shows only disciplinary case form fields */}
      {viewingCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setViewingCase(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Employee Details
                  </h3>
                  <button
                    onClick={() => {
                      console.log('Viewing case data:', viewingCase);
                      console.log('Case keys:', Object.keys(viewingCase));
                      setViewingCase(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* Display all fields that exist in the case data */}
                    {(() => {
                      if (!viewingCase) return null;
                      
                      // First, try to display form fields if they exist
                      const formFields = [
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
                      ];
                      
                      // Map old field names to friendly labels
                      const fieldLabelMap = {
                        employeeId: 'Employee ID',
                        employeeName: 'Employee Name',
                        name: 'Name',
                        employeeEmail: 'Employee Email',
                        department: 'Department',
                        position: 'Position',
                        incidentDate: 'Incident Date',
                        reportedDate: 'Reported Date',
                        description: 'Description',
                        severity: 'Severity',
                        status: 'Status',
                        actionTaken: 'Action Taken',
                        notes: 'Notes',
                        remarks: 'Remarks',
                      };
                      
                      // Get all keys from case data, filter out internal fields
                      const internalFields = ['id', 'timestamp', 'createdAt', 'updatedAt'];
                      const caseKeys = Object.keys(viewingCase).filter(key => !internalFields.includes(key));
                      const displayedKeys = new Set();
                      
                      // First, process ALL form fields (show all, even if empty)
                      const formFieldsElements = formFields
                        .map(({ key, label, altKey, isDate, isBoolean }) => {
                          let value = viewingCase[key];
                          if ((value === undefined || value === null || value === '') && altKey) {
                            value = viewingCase[altKey];
                          }
                          
                          // Track displayed keys
                          if (key in viewingCase) displayedKeys.add(key);
                          if (altKey && altKey in viewingCase) displayedKeys.add(altKey);
                          
                          let displayValue;
                          
                          if (isBoolean) {
                            // Boolean fields always show Yes/No
                            displayValue = value === true || value === 'yes' || value === 'Yes' ? 'Yes' : 'No';
                          } else if (isDate && value) {
                            // Format dates
                            try {
                              const date = new Date(value);
                              displayValue = isNaN(date.getTime()) ? value : date.toLocaleDateString();
                            } catch {
                              displayValue = value;
                            }
                          } else if (value === null || value === undefined || value === '') {
                            // Empty values show as "-"
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
                        });
                      
                      // Then, add any other fields from the case that we haven't displayed yet
                      const otherFieldsElements = caseKeys
                        .filter(key => !displayedKeys.has(key))
                        .map(key => {
                          const value = viewingCase[key];
                          if (value === null || value === undefined || value === '') {
                            return null;
                          }
                          
                          let displayValue = String(value);
                          
                          // Try to format dates
                          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                            try {
                              const date = new Date(value);
                              if (!isNaN(date.getTime())) {
                                displayValue = date.toLocaleDateString();
                              }
                            } catch {
                              // Keep original value
                            }
                          }
                          
                          const label = fieldLabelMap[key] || key.replace(/([A-Z])/g, ' $1').trim();
                          
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
                        })
                        .filter(Boolean);
                      
                      return [...formFieldsElements, ...otherFieldsElements];
                    })()}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setViewingCase(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case - Navigate to edit page */}
      {editingCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setEditingCase(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Case
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You will be redirected to the edit page for this case.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setEditingCase(null);
                    navigate(`/cases/${editingCase.id}/edit`);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Go to Edit
                </button>
                <button
                  onClick={() => setEditingCase(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;

