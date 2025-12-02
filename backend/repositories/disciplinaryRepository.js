const localStorageService = require('../utils/localStorageService');
const STORAGE_KEY = 'disciplinary_cases';

const findAll = async () => {
  return localStorageService.getAll(STORAGE_KEY);
};

const findById = async (id) => {
  const cases = await findAll();
  return cases.find(c => c.id === id) || null;
};

const create = async (caseData) => {
  const cases = await findAll();
  cases.push(caseData);
  localStorageService.saveAll(STORAGE_KEY, cases);
  return caseData;
};

const update = async (id, caseData) => {
  const cases = await findAll();
  const index = cases.findIndex(c => c.id === id);
  if (index === -1) {
    return null;
  }
  cases[index] = caseData;
  localStorageService.saveAll(STORAGE_KEY, cases);
  return caseData;
};

const deleteCase = async (id) => {
  const cases = await findAll();
  const filteredCases = cases.filter(c => c.id !== id);
  if (filteredCases.length === cases.length) {
    return false;
  }
  localStorageService.saveAll(STORAGE_KEY, filteredCases);
  return true;
};

const findByEmployeeId = async (employeeId) => {
  const cases = await findAll();
  return cases.filter(c => c.employeeId === employeeId);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteCase,
  findByEmployeeId
};

