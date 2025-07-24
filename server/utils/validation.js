// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

// Username validation
const isValidUsername = (username) => {
    // 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
};

// Validate registration data
const validateRegistration = (userData) => {
    const { username, email, password } = userData;
    const errors = [];
  
    if (!username || !isValidUsername(username)) {
      errors.push('Username must be 3-30 characters, letters, numbers, and underscores only');
    }
  
    if (!email || !isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }
  
    if (!password || !isValidPassword(password)) {
      errors.push('Password must be at least 6 characters long');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
};

// Validate login data
const validateLogin = (userData) => {
    const { email, password } = userData;
    const errors = [];
  
    if (!email || !isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }
  
    if (!password) {
      errors.push('Password is required');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidUsername,
    validateRegistration,
    validateLogin
};
  