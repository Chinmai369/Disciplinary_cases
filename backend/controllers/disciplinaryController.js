const disciplinaryService = require('../services/disciplinaryService');

const getAllCases = async (req, res) => {
  try {
    const cases = await disciplinaryService.getAllCases();
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = await disciplinaryService.getCaseById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCase = async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = await disciplinaryService.createCase(caseData);
    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = req.body;
    const updatedCase = await disciplinaryService.updateCase(caseId, caseData);
    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const deleted = await disciplinaryService.deleteCase(caseId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCasesByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const cases = await disciplinaryService.getCasesByEmployee(employeeId);
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getCasesByEmployee
};

