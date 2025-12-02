const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '../storage');
const ensureStorageDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
};

const getFilePath = (key) => {
  ensureStorageDir();
  return path.join(STORAGE_DIR, `${key}.json`);
};

const getAll = (key) => {
  try {
    const filePath = getFilePath(key);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
};

const saveAll = (key, data) => {
  try {
    const filePath = getFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to storage:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  saveAll
};

