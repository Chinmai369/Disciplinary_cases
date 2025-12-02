/**
 * Seed initial users for testing
 * Run this script to create default users
 */

const localStorageService = require('./localStorageService');
const STORAGE_KEY = 'users';

const seedUsers = () => {
  const defaultUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      password: 'user123', // In production, this should be hashed
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    localStorageService.saveAll(STORAGE_KEY, defaultUsers);
    console.log('Default users created successfully!');
    console.log('Username: admin, Password: admin123');
    console.log('Username: user, Password: user123');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;

