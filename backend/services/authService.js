const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');

// JWT Secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Token expires in 7 days

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

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
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
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database using decoded user ID
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    return null;
  }
};

module.exports = {
  login,
  register,
  verifyToken,
  generateToken
};

