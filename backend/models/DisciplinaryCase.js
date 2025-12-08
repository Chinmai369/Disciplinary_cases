/**
 * Disciplinary Case Model
 * This model represents the structure of a disciplinary case
 * 
 * When connecting to a database, this will be used to define the schema
 */

class DisciplinaryCase {
  constructor(data) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.employeeName = data.employeeName || '';
    this.employeeEmail = data.employeeEmail || '';
    this.department = data.department || '';
    this.position = data.position || '';
    this.incidentDate = data.incidentDate || null;
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.description = data.description || '';
    this.severity = data.severity || 'Medium'; // Low, Medium, High, Critical
    this.status = data.status || 'Pending'; // Pending, Under Review, Resolved, Closed
    this.actionTaken = data.actionTaken || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    // Note: employeeId is optional, not required
    // if (!this.employeeId) errors.push('Employee ID is required');
    if (!this.employeeName || this.employeeName.trim() === '') errors.push('Employee Name is required');
    if (!this.incidentDate) errors.push('Incident Date is required');
    if (!this.description) errors.push('Description is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = DisciplinaryCase;

