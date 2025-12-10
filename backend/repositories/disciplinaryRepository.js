const storage = require('../utils/localStorageService');

// Get all cases
const findAll = async () => {
  return storage.getAll('disciplinary_cases');
};

// Get case by ID
const findById = async (id) => {
  const cases = storage.getAll('disciplinary_cases');
  return cases.find(c => c.id === id) || null;
};

// Create new case
const create = async (caseData) => {
  const cases = storage.getAll('disciplinary_cases');
  const newCase = {
    ...caseData,
    id: caseData.id || Date.now().toString(),
    createdAt: caseData.createdAt || new Date().toISOString(),
    updatedAt: caseData.updatedAt || new Date().toISOString()
  };
  cases.push(newCase);
  storage.saveAll('disciplinary_cases', cases);
  return newCase;
};

// Update case
const update = async (id, caseData) => {
  const cases = storage.getAll('disciplinary_cases');
  const index = cases.findIndex(c => c.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedCase = {
    ...cases[index],
    ...caseData,
    id: id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  cases[index] = updatedCase;
  storage.saveAll('disciplinary_cases', cases);
  return updatedCase;
};

// Delete case
const deleteCase = async (id) => {
  const cases = storage.getAll('disciplinary_cases');
  const filteredCases = cases.filter(c => c.id !== id);
  
  if (filteredCases.length === cases.length) {
    return false; // Case not found
  }
  
  storage.saveAll('disciplinary_cases', filteredCases);
  return true;
};

// Find cases by employee ID
const findByEmployeeId = async (employeeId) => {
  const cases = storage.getAll('disciplinary_cases');
  return cases.filter(c => 
    c.employeeId === employeeId || 
    (c.employeeId && c.employeeId.toString() === employeeId.toString())
  );
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteCase,
  findByEmployeeId
};
