import React, { useState, useEffect } from 'react';
import { getCases } from '../services/api';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCases([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = cases.filter((caseItem) => {
      const employeeName = (caseItem.employeeName || caseItem.name || '').toLowerCase();
      const employeeId = (caseItem.employeeId || '').toLowerCase();
      
      const matches = employeeName.includes(query) || employeeId.includes(query);
      
      if (matches) {
        console.log('Match found:', {
          name: caseItem.employeeName || caseItem.name,
          id: caseItem.employeeId,
          query: query
        });
      }
      
      return matches;
    });

    console.log('Search query:', query);
    console.log('Total cases:', cases.length);
    console.log('Filtered cases:', filtered.length);
    setFilteredCases(filtered);
  }, [searchQuery, cases]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await getCases();
      let casesData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        casesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        casesData = response.data;
      }
      console.log('Reports: Fetched cases:', casesData.length);
      console.log('Reports: Sample case:', casesData[0]);
      setCases(casesData);
    } catch (error) {
      console.error('Error fetching cases:', error);
      console.error('Error details:', error.response?.data || error.message);
      setCases([]);
    } finally {
      setLoading(false);
    }
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

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-md">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 text-sm mt-0.5">Search cases by employee name or ID</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-lg p-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Search Employee</h2>
        </div>
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredCases.length > 0 
                ? `Found ${filteredCases.length} case(s)` 
                : cases.length > 0 
                ? 'No cases found matching your search'
                : 'No cases available in the system'}
            </p>
          )}
          {!searchQuery && cases.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {cases.length} case(s) available. Enter employee name or ID to search.
            </p>
          )}
        </div>
      </div>

      {/* Results Table */}
      {searchQuery && filteredCases.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Case Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">Search results for "{searchQuery}"</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    S.No
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    File Number
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Employee ID
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Employee Name
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Sub Category
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Date of Incident
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((caseItem, index) => (
                  <tr key={caseItem.id} className="hover:bg-blue-50 transition-colors duration-150 even:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.fileNumber || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.employeeId || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caseItem.employeeName || caseItem.name || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {caseItem.categoryOfCase || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {caseItem.subCategoryOfCase || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.dateOfIncident ? (
                        new Date(caseItem.dateOfIncident).toLocaleDateString()
                      ) : caseItem.incidentDate ? (
                        new Date(caseItem.incidentDate).toLocaleDateString()
                      ) : '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {caseItem.status ? (
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            caseItem.status
                          )}`}
                        >
                          {caseItem.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && filteredCases.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 font-medium text-lg">No cases found</p>
          <p className="text-gray-400 text-sm mt-2">Try searching with a different employee name or ID</p>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedCase(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Complete Case Details</h3>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-white px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">File Number</p>
                      <p className="text-sm text-gray-900">{selectedCase.fileNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">E-Office Number</p>
                      <p className="text-sm text-gray-900">{selectedCase.eOfficeNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Employee ID</p>
                      <p className="text-sm text-gray-900">{selectedCase.employeeId || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Employee Name</p>
                      <p className="text-sm text-gray-900 font-medium">{selectedCase.employeeName || selectedCase.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Designation</p>
                      <p className="text-sm text-gray-900">{selectedCase.designationWhenChargesIssued || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">ULB</p>
                      <p className="text-sm text-gray-900">{selectedCase.nameOfULB || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Case Type</p>
                      <p className="text-sm text-gray-900">{selectedCase.caseType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Date of Incident</p>
                      <p className="text-sm text-gray-900">
                        {selectedCase.dateOfIncident 
                          ? new Date(selectedCase.dateOfIncident).toLocaleDateString()
                          : selectedCase.incidentDate
                          ? new Date(selectedCase.incidentDate).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Category</p>
                      <p className="text-sm text-gray-900">{selectedCase.categoryOfCase || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Sub Category</p>
                      <p className="text-sm text-gray-900">{selectedCase.subCategoryOfCase || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Suspension Details */}
                {(selectedCase.employeeSuspended || selectedCase.suspendedBy || selectedCase.suspensionDate) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Suspension Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Employee Suspended</p>
                        <p className="text-sm text-gray-900">{selectedCase.employeeSuspended || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Suspended By</p>
                        <p className="text-sm text-gray-900">{selectedCase.suspendedBy || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Proceeding Number</p>
                        <p className="text-sm text-gray-900">{selectedCase.suspensionProceedingNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Suspension Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.suspensionDate ? new Date(selectedCase.suspensionDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Employee Reinitiated</p>
                        <p className="text-sm text-gray-900">{selectedCase.employeeReinitiated || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Reinitiation Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.reinitiationDate ? new Date(selectedCase.reinitiationDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Criminal Case Details */}
                {(selectedCase.criminalCaseFiled || selectedCase.criminalCaseNumber) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Criminal Case Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Criminal Case Filed</p>
                        <p className="text-sm text-gray-900">{selectedCase.criminalCaseFiled || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Case Number</p>
                        <p className="text-sm text-gray-900">{selectedCase.criminalCaseNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Case Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.criminalCaseDate ? new Date(selectedCase.criminalCaseDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prosecution & Charges */}
                {(selectedCase.prosecutionSanctioned || selectedCase.chargesIssued) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Prosecution & Charges</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Prosecution Sanctioned</p>
                        <p className="text-sm text-gray-900">{selectedCase.prosecutionSanctioned || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Prosecution Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.prosecutionDate ? new Date(selectedCase.prosecutionDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Charges Issued</p>
                        <p className="text-sm text-gray-900">{selectedCase.chargesIssued || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Charges Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.chargesDate ? new Date(selectedCase.chargesDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      {selectedCase.chargesIssuedRemarks && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Charges Remarks</p>
                          <p className="text-sm text-gray-900">{selectedCase.chargesIssuedRemarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* WSD Details */}
                {(selectedCase.wsdOrServedCopy || selectedCase.wsdDate || selectedCase.furtherActionWSD) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">WSD Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">WSD or Served Copy</p>
                        <p className="text-sm text-gray-900">{selectedCase.wsdOrServedCopy || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">WSD Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.wsdDate ? new Date(selectedCase.wsdDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Further Action</p>
                        <p className="text-sm text-gray-900">{selectedCase.furtherActionWSD || '-'}</p>
                      </div>
                      {selectedCase.concludeText && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Conclusion</p>
                          <p className="text-sm text-gray-900">{selectedCase.concludeText}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Inquiry Report Details */}
                {(selectedCase.inquiryReportSubmitted || selectedCase.inquiryReportDate) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Inquiry Report Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Report Submitted</p>
                        <p className="text-sm text-gray-900">{selectedCase.inquiryReportSubmitted || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Report Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.inquiryReportDate ? new Date(selectedCase.inquiryReportDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Report Number</p>
                        <p className="text-sm text-gray-900">{selectedCase.inquiryReportNumber || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* WR Details */}
                {(selectedCase.wrOrServedCopy || selectedCase.punishmentDate) && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">WR Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">WR or Served Copy</p>
                        <p className="text-sm text-gray-900">{selectedCase.wrOrServedCopy || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Punishment Number</p>
                        <p className="text-sm text-gray-900">{selectedCase.punishmentNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Punishment Date</p>
                        <p className="text-sm text-gray-900">
                          {selectedCase.punishmentDate ? new Date(selectedCase.punishmentDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {selectedCase.remarks && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-200">Remarks</h4>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedCase.remarks}</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

