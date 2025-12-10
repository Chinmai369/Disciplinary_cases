const storage = require('../utils/localStorageService');

// Get all active users
const findAll = async () => {
  const users = storage.getAll('users');
  return users
    .filter(user => user.is_active !== false && user.isActive !== false)
    .map(user => {
      const { password, password_hash, passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    })
    .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
};

// Get user by ID
const findById = async (id) => {
  const users = storage.getAll('users');
  const user = users.find(u => u.id === id.toString() || u.id === id);
  if (!user) return null;
  
  const { password, password_hash, passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Find user by username
const findByUsername = async (username) => {
  const users = storage.getAll('users');
  return users.find(u => u.username === username) || null;
};

// Find user by email
const findByEmail = async (email) => {
  const users = storage.getAll('users');
  return users.find(u => u.email === email) || null;
};

// Create new user
const create = async (userData) => {
  const users = storage.getAll('users');
  
  // Check if username or email already exists
  if (users.find(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  if (users.find(u => u.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  // Generate ID
  const maxId = users.length > 0 
    ? Math.max(...users.map(u => parseInt(u.id) || 0))
    : 0;
  const newId = (maxId + 1).toString();
  
  const newUser = {
    id: newId,
    username: userData.username,
    email: userData.email,
    password: userData.password_hash || userData.passwordHash || userData.password,
    password_hash: userData.password_hash || userData.passwordHash || userData.password,
    role: userData.role || 'user',
    full_name: userData.full_name || userData.fullName || null,
    is_active: userData.is_active !== undefined ? userData.is_active : (userData.isActive !== undefined ? userData.isActive : true),
    last_login: userData.last_login || userData.lastLogin || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  storage.saveAll('users', users);
  
  const { password, password_hash: ph, passwordHash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Update user
const update = async (id, userData) => {
  const users = storage.getAll('users');
  const index = users.findIndex(u => u.id === id.toString() || u.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const existingUser = users[index];
  
  // Check if username or email conflicts with other users
  if (userData.username && userData.username !== existingUser.username) {
    if (users.find(u => u.id !== id.toString() && u.id !== id && u.username === userData.username)) {
      throw new Error('Username already exists');
    }
  }
  if (userData.email && userData.email !== existingUser.email) {
    if (users.find(u => u.id !== id.toString() && u.id !== id && u.email === userData.email)) {
      throw new Error('Email already exists');
    }
  }
  
  const updatedUser = {
    ...existingUser,
    username: userData.username !== undefined ? userData.username : existingUser.username,
    email: userData.email !== undefined ? userData.email : existingUser.email,
    password: userData.password_hash || userData.passwordHash || userData.password || existingUser.password,
    password_hash: userData.password_hash || userData.passwordHash || existingUser.password_hash || existingUser.password,
    role: userData.role !== undefined ? userData.role : existingUser.role,
    full_name: userData.full_name !== undefined ? userData.full_name : (userData.fullName !== undefined ? userData.fullName : existingUser.full_name),
    is_active: userData.is_active !== undefined ? userData.is_active : (userData.isActive !== undefined ? userData.isActive : existingUser.is_active),
    last_login: userData.last_login !== undefined ? userData.last_login : (userData.lastLogin !== undefined ? userData.lastLogin : existingUser.last_login),
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  storage.saveAll('users', users);
  
  const { password, password_hash: ph, passwordHash, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Update last login
const updateLastLogin = async (id) => {
  const users = storage.getAll('users');
  const index = users.findIndex(u => u.id === id.toString() || u.id === id);
  
  if (index === -1) {
    return;
  }
  
  users[index].last_login = new Date().toISOString();
  users[index].updatedAt = new Date().toISOString();
  storage.saveAll('users', users);
};

module.exports = {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  create,
  update,
  updateLastLogin
};
