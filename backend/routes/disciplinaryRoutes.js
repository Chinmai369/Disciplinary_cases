const express = require('express');
const router = express.Router();
const disciplinaryController = require('../controllers/disciplinaryController');

// Get all disciplinary cases
router.get('/', disciplinaryController.getAllCases);

// Get a single case by ID
router.get('/:id', disciplinaryController.getCaseById);

// Create a new disciplinary case
router.post('/', disciplinaryController.createCase);

// Update a disciplinary case
router.put('/:id', disciplinaryController.updateCase);

// Delete a disciplinary case
router.delete('/:id', disciplinaryController.deleteCase);

// Get cases by employee ID
router.get('/employee/:employeeId', disciplinaryController.getCasesByEmployee);

module.exports = router;

