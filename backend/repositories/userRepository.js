const db = require('../database/db');

const findAll = async () => {
  const results = await db.query(
    'SELECT id, username, email, role, full_name, is_active, last_login, created_at, updated_at FROM users WHERE is_active = TRUE ORDER BY created_at DESC'
  );
  return results;
};

const findById = async (id) => {
  const results = await db.query(
    'SELECT id, username, email, role, full_name, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return results[0] || null;
};

const findByUsername = async (username) => {
  const results = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return results[0] || null;
};

const findByEmail = async (email) => {
  const results = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return results[0] || null;
};

const create = async (userData) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, role, full_name, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userData.username,
      userData.email,
      userData.password_hash || userData.passwordHash,
      userData.role || 'user',
      userData.full_name || userData.fullName || null,
      userData.is_active !== undefined ? userData.is_active : (userData.isActive !== undefined ? userData.isActive : true)
    ]
  );
  
  return await findById(result.insertId);
};

const update = async (id, userData) => {
  await db.query(
    `UPDATE users 
     SET username = COALESCE(?, username),
         email = COALESCE(?, email),
         password_hash = COALESCE(?, password_hash),
         role = COALESCE(?, role),
         full_name = COALESCE(?, full_name),
         is_active = COALESCE(?, is_active),
         last_login = COALESCE(?, last_login),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      userData.username,
      userData.email,
      userData.password_hash || userData.passwordHash,
      userData.role,
      userData.full_name || userData.fullName,
      userData.is_active !== undefined ? userData.is_active : userData.isActive,
      userData.last_login || userData.lastLogin,
      id
    ]
  );
  
  return await findById(id);
};

const updateLastLogin = async (id) => {
  await db.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
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
