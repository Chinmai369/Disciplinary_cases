/**
 * User Model
 * This model represents the structure of a user
 */

class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || ''; // In production, this should be hashed
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = [];
    
    if (!this.username) errors.push('Username is required');
    if (!this.email) errors.push('Email is required');
    if (!this.password) errors.push('Password is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;

