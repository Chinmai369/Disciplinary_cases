const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const seedUsers = require('./utils/seedUsers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Seed default users on startup (only if no users exist)
const fs = require('fs');
const path = require('path');
const storageDir = path.join(__dirname, 'storage');
const usersFile = path.join(storageDir, 'users.json');
if (!fs.existsSync(usersFile)) {
  seedUsers();
}

// Routes
const authRoutes = require('./routes/authRoutes');
const disciplinaryRoutes = require('./routes/disciplinaryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/disciplinary', disciplinaryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

