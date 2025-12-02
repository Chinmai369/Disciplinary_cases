const userRepository = require('../repositories/userRepository');
const User = require('../models/User');

// Simple password comparison (in production, use bcrypt)
const comparePassword = (plainPassword, hashedPassword) => {
  // For now, we'll store passwords as plain text (NOT for production!)
  // In production, use: bcrypt.compare(plainPassword, hashedPassword)
  return plainPassword === hashedPassword;
};

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password) => {
  // For now, return as is (NOT for production!)
  // In production, use: bcrypt.hash(password, 10)
  return password;
};

const login = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = await userRepository.findByUsername(username);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const register = async (userData) => {
  // Check if user already exists
  const existingUser = await userRepository.findByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const existingEmail = await userRepository.findByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    password: hashPassword(userData.password),
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const user = await userRepository.create(newUser);
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const verifyToken = async (token) => {
  // For now, we'll use a simple token system
  // In production, use JWT tokens
  try {
    // Simple token verification (in production, use JWT.verify)
    const users = await userRepository.findAll();
    const user = users.find(u => u.id === token);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  login,
  register,
  verifyToken
};

