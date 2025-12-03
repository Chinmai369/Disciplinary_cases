const disciplinaryRepository = require('../repositories/disciplinaryRepository');

const getAllCases = async () => {
  return await disciplinaryRepository.findAll();
};

const getCaseById = async (id) => {
  return await disciplinaryRepository.findById(id);
};

const createCase = async (caseData) => {
  // Validate required fields - support both old and new form structure
  const employeeName = caseData.employeeName || caseData.name;
  if (!caseData.employeeId || !employeeName) {
    throw new Error('Missing required fields: employeeId and name are required');
  }

  // Create case with all fields from the form (supporting both old and new structure)
  // Spread caseData first, then override with specific mappings
  const newCase = {
    ...caseData, // Include all form fields first
    id: Date.now().toString(),
    employeeId: caseData.employeeId,
    employeeName: employeeName, // Map name to employeeName for compatibility
    name: caseData.name || employeeName, // Keep name field too
    // Ensure backward compatibility fields have defaults
    employeeEmail: caseData.employeeEmail || '',
    department: caseData.department || '',
    position: caseData.position || '',
    incidentDate: caseData.incidentDate || '',
    reportedDate: caseData.reportedDate || new Date().toISOString(),
    description: caseData.description || caseData.remarks || '',
    severity: caseData.severity || 'Medium',
    status: caseData.status || 'Pending',
    actionTaken: caseData.actionTaken || '',
    notes: caseData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return await disciplinaryRepository.create(newCase);
};

const updateCase = async (id, caseData) => {
  const existingCase = await disciplinaryRepository.findById(id);
  if (!existingCase) {
    return null;
  }

  const updatedCase = {
    ...existingCase,
    ...caseData,
    updatedAt: new Date().toISOString()
  };

  return await disciplinaryRepository.update(id, updatedCase);
};

const deleteCase = async (id) => {
  return await disciplinaryRepository.deleteCase(id);
};

const getCasesByEmployee = async (employeeId) => {
  return await disciplinaryRepository.findByEmployeeId(employeeId);
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getCasesByEmployee
};

