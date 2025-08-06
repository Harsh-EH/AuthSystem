// utils/generatePassword.js
const generatePassword = () => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2).toUpperCase();
};

module.exports = generatePassword;
