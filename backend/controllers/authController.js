const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const user = await authService.login(username, password);
    
    // Generate JWT token
    const token = authService.generateToken(user);

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message || 'Login failed' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    const user = await authService.register({ username, email, password, role });
    
    // Generate JWT token
    const token = authService.generateToken(user);

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

const verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }

    const user = await authService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    res.json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message || 'Token verification failed' 
    });
  }
};

module.exports = {
  login,
  register,
  verify
};

