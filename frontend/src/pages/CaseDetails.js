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
      setCaseData(response.data);
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

        {/* Content Section */}
        <div className="px-6 py-6 space-y-6">
          {/* Employee Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {caseData.employeeEmail || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-sm text-gray-900">
                  {caseData.department || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Position</label>
                <p className="mt-1 text-sm text-gray-900">
                  {caseData.position || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Incident Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Incident Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(caseData.incidentDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Reported Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {caseData.reportedDate
                    ? new Date(caseData.reportedDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Description
            </label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
              {caseData.description}
            </p>
          </div>

          {/* Action Taken */}
          {caseData.actionTaken && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Action Taken
              </label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                {caseData.actionTaken}
              </p>
            </div>
          )}

          {/* Notes */}
          {caseData.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Notes
              </label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                {caseData.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(caseData.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(caseData.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;

