import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCases, deleteCase } from '../services/api';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', severity: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await getCases();
      // Handle API response structure: axios wraps in response.data
      // Backend returns: { success: true, data: [...] }
      // So we need: response.data.data
      let casesData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        casesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        casesData = response.data;
      }
      setCases(casesData);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteCase(id);
        fetchCases();
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case');
      }
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesStatus = !filter.status || caseItem.status === filter.status;
    const matchesSeverity = !filter.severity || caseItem.severity === filter.severity;
    const employeeName = caseItem.employeeName || caseItem.name || '';
    const employeeId = caseItem.employeeId || '';
    const description = caseItem.description || '';
    const fileNumber = caseItem.fileNumber || '';
    const matchesSearch =
      !searchTerm ||
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fileNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSeverity && matchesSearch;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">All Disciplinary Cases</h1>
        <Link
          to="/cases/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          New Case
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={filter.severity}
              onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  S.No
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  File Number
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Employee ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Sub Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Date of Incident
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 divide-y divide-gray-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 sm:px-6 py-4 text-center text-gray-500 border border-gray-300">
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem, index) => (
                  <tr key={caseItem.id} className="hover:bg-blue-100">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {caseItem.fileNumber || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {caseItem.employeeId || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                      {caseItem.employeeName || caseItem.name || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 border border-gray-300">
                      {caseItem.categoryOfCase || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 border border-gray-300">
                      {caseItem.subCategoryOfCase || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap border border-gray-300">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium border border-gray-300">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/cases/${caseItem.id}`}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          to={`/cases/${caseItem.id}/edit`}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(caseItem.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm transition-colors"
                        >
                          Delete
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
    </div>
  );
};

export default CaseList;

