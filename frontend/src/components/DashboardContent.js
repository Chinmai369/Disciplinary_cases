import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCases } from '../services/api';

const DashboardContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    department: 0,
    departmentActive: 0,
    departmentRetired: 0,
    acb: 0,
    acbActive: 0,
    acbRetired: 0,
    vigilance: 0,
    vigilanceActive: 0,
    vigilanceRetired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [viewingCase, setViewingCase] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const [showTotalCasesTable, setShowTotalCasesTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Memoize fetchData to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
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
      
      setCases(cases);
      
      // Helper function to check if employee is retired
      const isRetired = (caseItem) => {
        // Check various possible field names for retirement status
        const employeeStatus = caseItem.employeeStatus || caseItem.employmentStatus || caseItem.statusOfEmployee;
        const isRetiredFlag = caseItem.isRetired || caseItem.retired || caseItem.isEmployeeRetired;
        const retirementDate = caseItem.retirementDate || caseItem.dateOfRetirement;
        
        // If there's an explicit status field
        if (employeeStatus) {
          const status = String(employeeStatus).toLowerCase();
          return status.includes('retired') || status === 'retired';
        }
        
        // If there's a boolean flag
        if (isRetiredFlag !== undefined && isRetiredFlag !== null) {
          return isRetiredFlag === true || String(isRetiredFlag).toLowerCase() === 'yes' || String(isRetiredFlag).toLowerCase() === 'true';
        }
        
        // If there's a retirement date, consider them retired
        if (retirementDate) {
          return true;
        }
        
        // Default to active if no retirement indicators found
        return false;
      };
      
      // Calculate stats with bifurcation
      const departmentCases = cases.filter(c => c.categoryOfCase === 'Department');
      const acbCases = cases.filter(c => c.categoryOfCase === 'ACB');
      const vigilanceCases = cases.filter(c => c.categoryOfCase === 'Vigilance and Enforcement');
      
      setStats({
        department: departmentCases.length,
        departmentActive: departmentCases.filter(c => !isRetired(c)).length,
        departmentRetired: departmentCases.filter(c => isRetired(c)).length,
        acb: acbCases.length,
        acbActive: acbCases.filter(c => !isRetired(c)).length,
        acbRetired: acbCases.filter(c => isRetired(c)).length,
        vigilance: vigilanceCases.length,
        vigilanceActive: vigilanceCases.filter(c => !isRetired(c)).length,
        vigilanceRetired: vigilanceCases.filter(c => isRetired(c)).length,
      });

      console.log('Fetched cases:', cases.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Set empty stats on error to prevent display issues
      setCases([]);
      setStats({
        department: 0,
        departmentActive: 0,
        departmentRetired: 0,
        acb: 0,
        acbActive: 0,
        acbRetired: 0,
        vigilance: 0,
        vigilanceActive: 0,
        vigilanceRetired: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Main effect: Only run when on dashboard page
  useEffect(() => {
    // Only fetch data when on dashboard
    if (location.pathname !== '/') {
      return;
    }

    // Initial fetch when navigating to dashboard
    fetchData();
    
    // Optional: Refresh when page becomes visible (e.g., user switches back to tab)
    // Uncomment the code below if you want this feature
    /*
    const handleVisibilityChange = () => {
      if (!document.hidden && location.pathname === '/') {
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    */
  }, [location.pathname, fetchData]);


  const statCards = [
    { 
      label: 'Department Cases', 
      value: stats.department,
      active: stats.departmentActive || 0,
      retired: stats.departmentRetired || 0,
      headerGradient: 'linear-gradient(to right, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-600',
      numberColor: 'text-blue-600',
      category: 'Department' 
    },
    { 
      label: 'ACB Cases', 
      value: stats.acb,
      active: stats.acbActive || 0,
      retired: stats.acbRetired || 0,
      headerGradient: 'linear-gradient(to right, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-600',
      numberColor: 'text-orange-600',
      category: 'ACB' 
    },
    { 
      label: 'Vigilance & Enforcement Cases', 
      value: stats.vigilance,
      active: stats.vigilanceActive || 0,
      retired: stats.vigilanceRetired || 0,
      headerGradient: 'linear-gradient(to right, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-600',
      numberColor: 'text-purple-600',
      category: 'Vigilance and Enforcement' 
    },
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-md">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-0.5">Overview of all disciplinary cases</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            onClick={() => {
              if (stat.category) {
                setSelectedCategory(stat.category);
                setShowTotalCasesTable(true);
              }
            }}
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-blue-300 transform hover:-translate-y-0.5"
          >
            {/* Card Header with Gradient */}
            <div 
              className="px-5 py-3 relative overflow-hidden"
              style={{ background: stat.headerGradient }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className={`${stat.textColor} font-bold text-sm leading-tight`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="px-5 py-4 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <p className={`${stat.numberColor} text-3xl md:text-4xl font-extrabold mb-1.5 tracking-tight`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="group-hover:text-gray-800 transition-colors">Click to view cases</span>
                  </p>
                </div>
                <div className={`${stat.iconBg} opacity-10 rounded-lg p-2 transform group-hover:scale-125 transition-transform duration-300`}>
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
              </div>
              
              {/* Bifurcation: Active vs Retired */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-semibold text-gray-700">Active</span>
                    </div>
                    <p className="text-lg font-bold text-green-600 ml-4">{stat.active || 0}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-xs font-semibold text-gray-700">Retired</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600 ml-4">{stat.retired || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Cases Table - Shows when Total Cases card is clicked */}
      {showTotalCasesTable && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory} Cases` : 'Total Cases - All Submitted Cases'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">View and manage all cases in this category</p>
            </div>
            <button
              onClick={() => {
                setShowTotalCasesTable(false);
                setSelectedCategory(null);
              }}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    File Number
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Sub Category
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date of Incident
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    ULB
                  </th>
                  <th className="px-2 sm:px-3 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const filteredCases = selectedCategory 
                    ? cases.filter(c => c.categoryOfCase === selectedCategory)
                    : cases;
                  
                  return filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-500 font-medium text-sm">No cases found</p>
                          <p className="text-gray-400 text-xs mt-1">Create a new case to see it here</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((caseItem, index) => (
                    <tr key={caseItem.id} className="hover:bg-blue-50 transition-colors duration-150 even:bg-gray-50">
                      <td className="px-2 sm:px-3 py-3 text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[100px]">
                        {caseItem.fileNumber || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[100px]">
                        {caseItem.employeeId || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm font-medium text-gray-900 break-words max-w-[120px]">
                        {caseItem.employeeName || caseItem.name || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[120px]">
                        {caseItem.categoryOfCase || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[120px]">
                        {caseItem.subCategoryOfCase || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700">
                        {caseItem.dateOfIncident ? (
                          (() => {
                            try {
                              const date = new Date(caseItem.dateOfIncident);
                              return isNaN(date.getTime()) ? caseItem.dateOfIncident : date.toLocaleDateString();
                            } catch (e) {
                              return caseItem.dateOfIncident || caseItem.incidentDate ? new Date(caseItem.incidentDate).toLocaleDateString() : '-';
                            }
                          })()
                        ) : caseItem.incidentDate ? (
                          new Date(caseItem.incidentDate).toLocaleDateString()
                        ) : '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[120px]">
                        {caseItem.designationWhenChargesIssued || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-sm text-gray-700 break-words max-w-[100px]">
                        {caseItem.nameOfULB || '-'}
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-center text-sm font-medium">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <button
                            onClick={() => setViewingCase(caseItem)}
                            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-xs transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditingCase(caseItem)}
                            className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-xs transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Case Modal - Shows only disciplinary case form fields */}
      {viewingCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setViewingCase(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Complete Case Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {viewingCase.fileNumber && `File Number: ${viewingCase.fileNumber}`}
                      {viewingCase.employeeName || viewingCase.name ? ` | Employee: ${viewingCase.employeeName || viewingCase.name}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      console.log('Viewing case data:', viewingCase);
                      console.log('Case keys:', Object.keys(viewingCase));
                      setViewingCase(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* Display all fields that exist in the case data */}
                    {(() => {
                      if (!viewingCase) return null;
                      
                      // First, try to display form fields if they exist - COMPLETE LIST OF ALL FORM FIELDS
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
                        { key: 'dateOfIncident', label: 'Date of Incident', isDate: true, altKey: 'incidentDate' },
                      
                        // Trap case fields - Suspension
                        { key: 'employeeSuspended', label: 'Employee Suspended' },
                        { key: 'suspendedBy', label: 'Suspended By' },
                        { key: 'suspensionProceedingNumber', label: 'Suspension Proceeding Number' },
                        { key: 'suspensionDate', label: 'Suspension Date', isDate: true },
                        
                        // Trap case fields - Reinitiation
                        { key: 'employeeReinitiated', label: 'Employee Re-initiated' },
                        { key: 'reinstatedBy', label: 'Reinstated By' },
                        { key: 'reinitiationProceedingNumber', label: 'Re-initiation Proceeding Number' },
                        { key: 'reinitiationDate', label: 'Re-initiation Date', isDate: true },
                        
                        // Trap case fields - Regularization
                        { key: 'suspensionPeriodRegularize', label: 'Suspension Period Regularize' },
                        { key: 'regularisedBy', label: 'Regularised By' },
                        { key: 'regularizationProceedingNumber', label: 'Regularization Proceeding Number' },
                        { key: 'regularizationDate', label: 'Regularization Date', isDate: true },
                        
                        // Trap case fields - Criminal Case
                        { key: 'criminalCaseFiled', label: 'Criminal Case Filed' },
                        { key: 'criminalCaseNumber', label: 'Criminal Case Number' },
                        { key: 'criminalCaseDate', label: 'Criminal Case Date', isDate: true },
                      
                        // Prosecution and charges - ALL DATES INCLUDED
                        { key: 'prosecutionSanctioned', label: 'Prosecution Sanctioned' },
                        { key: 'prosecutionIssuedBy', label: 'Prosecution Issued By' },
                        { key: 'prosecutionProceedingNumber', label: 'Prosecution Proceeding Number' },
                        { key: 'prosecutionDate', label: 'Prosecution Date', isDate: true },
                        { key: 'chargesIssued', label: 'Charges Issued' },
                        { key: 'chargeMemoNumberAndDate', label: 'Charge Memo Number & Date' },
                        { key: 'chargesMemoNumber', label: 'Charges Memo Number' },
                        { key: 'chargesDate', label: 'Charges Date', isDate: true },
                        { key: 'chargesIssuedRemarks', label: 'Charges Issued Remarks' },
                        { key: 'endorcementDate', label: 'Endorcement Date', isDate: true },
                        // Alternative field names for prosecution dates (if stored differently)
                        { key: 'prosecutionDateOfIssue', label: 'Prosecution Date of Issue', isDate: true },
                        { key: 'chargesDateOfIssue', label: 'Charges Date of Issue', isDate: true },
                        { key: 'endorsementDate', label: 'Endorsement Date', isDate: true },
                      
                        // WSD fields
                        { key: 'wsdOrServedCopy', label: 'WSD or Served Copy' },
                        { key: 'wsdCheckbox', label: 'WSD', isBoolean: true },
                        { key: 'servedCopyCheckbox', label: 'Served Copy', isBoolean: true },
                        { key: 'furtherActionWSD', label: 'Further Action (WSD)' },
                        { key: 'furtherActionWSDOthers', label: 'Further Action WSD (Others)' },
                        { key: 'concludeText', label: 'Conclude Text' },
                        { key: 'wsdIssuedBy', label: 'WSD Issued By' },
                        { key: 'wsdNumber', label: 'WSD Number' },
                        { key: 'wsdDate', label: 'WSD Date', isDate: true },
                        
                        // IO Appointment fields
                        { key: 'ioAppointment', label: 'IO Appointment' },
                        { key: 'ioGoProceedingsNumber', label: 'IO GO/Proceedings Number' },
                        { key: 'ioAppointmentDate', label: 'IO Appointment Date', isDate: true },
                        { key: 'ioAppointmentIOName', label: 'IO Appointment - IO Name' },
                        { key: 'ioAppointmentIODesignation', label: 'IO Appointment - IO Designation' },
                        
                        // PO Appointment fields
                        { key: 'poAppointment', label: 'PO Appointment' },
                        { key: 'poGoProceedingsNumber', label: 'PO GO/Proceedings Number' },
                        { key: 'poAppointmentDate', label: 'PO Appointment Date', isDate: true },
                        { key: 'poAppointmentIOName', label: 'PO Appointment - PO Name' },
                        { key: 'poAppointmentIODesignation', label: 'PO Appointment - PO Designation' },
                        
                        // Legacy IO/PO fields (for backward compatibility)
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
                        { key: 'inquiryReportDate', label: 'Inquiry Report Date', isDate: true },
                        { key: 'inquiryReportName', label: 'Inquiry Report Name' },
                        { key: 'inquiryReportCommunicated', label: 'Inquiry Report Communicated' },
                        { key: 'furtherActionInquiry', label: 'Further Action (Inquiry)' },
                        { key: 'inquiryDisagreedAction', label: 'Inquiry Disagreed Action' },
                        { key: 'inquiryAppointmentProceedingNumber', label: 'Inquiry Appointment Proceeding Number' },
                        { key: 'inquiryAppointmentIOName', label: 'Inquiry Appointment IO Name' },
                        { key: 'inquiryAppointmentIODate', label: 'Inquiry Appointment IO Date', isDate: true },
                        { key: 'inquiryRemittedNumber', label: 'Inquiry Remitted Number' },
                        { key: 'inquiryRemittedDate', label: 'Inquiry Remitted Date', isDate: true },
                        { key: 'inquiryCommunicationEndorsementDate', label: 'Inquiry Communication Endorsement Date', isDate: true },
                        { key: 'inquiryAgreedEndorsementDate', label: 'Inquiry Agreed Endorsement Date', isDate: true },
                        { key: 'inquiryEndorcementDate', label: 'Inquiry Endorcement Date', isDate: true },
                      
                        // WR fields
                        { key: 'wrOrServedCopy', label: 'WR or Served Copy' },
                        { key: 'wrCheckbox', label: 'WR', isBoolean: true },
                        { key: 'wrServedCopyCheckbox', label: 'WR Served Copy', isBoolean: true },
                        { key: 'furtherActionWR', label: 'Further Action (WR)' },
                        { key: 'furtherActionWRRemarks', label: 'Further Action WR Remarks' },
                        { key: 'wrIssuedBy', label: 'WR Issued By' },
                        { key: 'punishmentNumber', label: 'Punishment Number' },
                        { key: 'punishmentDate', label: 'Punishment Date', isDate: true },
                      
                        // Remarks
                        { key: 'remarks', label: 'Remarks' },
                        
                        // Additional fields that might exist
                        { key: 'description', label: 'Description' },
                        { key: 'severity', label: 'Severity' },
                        { key: 'status', label: 'Status' },
                        { key: 'actionTaken', label: 'Action Taken' },
                        { key: 'notes', label: 'Notes' },
                        { key: 'reportedDate', label: 'Reported Date', isDate: true },
                        { key: 'employeeEmail', label: 'Employee Email' },
                        { key: 'department', label: 'Department' },
                        { key: 'position', label: 'Position' },
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
                            displayValue = value === true || value === 'yes' || value === 'Yes' || value === true ? 'Yes' : 'No';
                          } else if (isDate && value) {
                            // Format dates - handle various date formats
                            try {
                              let date;
                              if (typeof value === 'string') {
                                // Try parsing different date formats
                                if (value.includes('T')) {
                                  date = new Date(value);
                                } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                  date = new Date(value + 'T00:00:00');
                                } else {
                                  date = new Date(value);
                                }
                              } else {
                                date = new Date(value);
                              }
                              
                              if (!isNaN(date.getTime())) {
                                displayValue = date.toLocaleDateString('en-GB', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  year: 'numeric' 
                                });
                              } else {
                                displayValue = value;
                              }
                            } catch (e) {
                              displayValue = value;
                            }
                          } else if (value === null || value === undefined || value === '') {
                            // Empty values show as "-"
                            displayValue = '-';
                          } else {
                            // Check if it looks like a date even if not marked as isDate
                            const valueStr = String(value);
                            if (valueStr.match(/^\d{4}-\d{2}-\d{2}/) || valueStr.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                              try {
                                const date = new Date(value);
                                if (!isNaN(date.getTime())) {
                                  displayValue = date.toLocaleDateString('en-GB', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                  });
                                } else {
                                  displayValue = valueStr;
                                }
                              } catch {
                                displayValue = valueStr;
                              }
                            } else {
                              displayValue = valueStr;
                            }
                          }
                          
                          // Always show the field, even if empty
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
                      // Show ALL fields, even if empty, to ensure nothing is missed
                      const otherFieldsElements = caseKeys
                        .filter(key => !displayedKeys.has(key))
                        .map(key => {
                          const value = viewingCase[key];
                          
                          let displayValue;
                          if (value === null || value === undefined || value === '') {
                            displayValue = '-';
                          } else {
                            const valueStr = String(value);
                            
                            // Try to format dates - check multiple date formats
                            if (valueStr.match(/^\d{4}-\d{2}-\d{2}/) || 
                                valueStr.match(/^\d{4}-\d{2}-\d{2}T/) ||
                                valueStr.match(/^\d{2}\/\d{2}\/\d{4}/) ||
                                valueStr.match(/^\d{2}-\d{2}-\d{4}/)) {
                              try {
                                let date;
                                if (valueStr.includes('T')) {
                                  date = new Date(valueStr);
                                } else if (valueStr.match(/^\d{4}-\d{2}-\d{2}/)) {
                                  date = new Date(valueStr + 'T00:00:00');
                                } else {
                                  date = new Date(valueStr);
                                }
                                
                                if (!isNaN(date.getTime())) {
                                  displayValue = date.toLocaleDateString('en-GB', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                  });
                                } else {
                                  displayValue = valueStr;
                                }
                              } catch {
                                displayValue = valueStr;
                              }
                            } else {
                              displayValue = valueStr;
                            }
                          }
                          
                          const label = fieldLabelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                          
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

