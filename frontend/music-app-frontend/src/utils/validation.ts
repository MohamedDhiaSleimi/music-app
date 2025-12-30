export const ValidationRules = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  USERNAME: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  },
  PASSWORD: {
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
  URL: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://',
  },
};

export const validate = {
  email: (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!ValidationRules.EMAIL.pattern.test(email)) {
      return ValidationRules.EMAIL.message;
    }
    return null;
  },

  username: (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < ValidationRules.USERNAME.minLength || username.length > ValidationRules.USERNAME.maxLength) {
      return `Username must be between ${ValidationRules.USERNAME.minLength} and ${ValidationRules.USERNAME.maxLength} characters`;
    }
    if (!ValidationRules.USERNAME.pattern.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < ValidationRules.PASSWORD.minLength) {
      return ValidationRules.PASSWORD.message;
    }
    return null;
  },

  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  },

  url: (url: string): string | null => {
    if (!url) return 'URL is required';
    if (!ValidationRules.URL.pattern.test(url)) {
      return ValidationRules.URL.message;
    }
    return null;
  },

  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },
};