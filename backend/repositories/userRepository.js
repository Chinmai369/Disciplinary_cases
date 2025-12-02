const localStorageService = require('../utils/localStorageService');
const STORAGE_KEY = 'users';

const findAll = async () => {
  return localStorageService.getAll(STORAGE_KEY);
};

const findById = async (id) => {
  const users = await findAll();
  return users.find(u => u.id === id) || null;
};

const findByUsername = async (username) => {
  const users = await findAll();
  return users.find(u => u.username === username) || null;
};

const findByEmail = async (email) => {
  const users = await findAll();
  return users.find(u => u.email === email) || null;
};

const create = async (userData) => {
  const users = await findAll();
  users.push(userData);
  localStorageService.saveAll(STORAGE_KEY, users);
  return userData;
};

const update = async (id, userData) => {
  const users = await findAll();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return null;
  }
  users[index] = userData;
  localStorageService.saveAll(STORAGE_KEY, users);
  return userData;
};

module.exports = {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  create,
  update
};

