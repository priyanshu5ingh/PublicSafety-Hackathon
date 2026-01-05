const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Session Configuration
  sessionSecret: process.env.SESSION_SECRET || 'your_session_secret_key',
  sessionCookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // requests per windowMs
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif').split(','),
    uploadDir: path.join(__dirname, '../uploads')
  },

  // Email Configuration
  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT) || 587,
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPassword: process.env.SMTP_PASSWORD,
    fromEmail: process.env.FROM_EMAIL || 'noreply@nammasuraksha.com',
    fromName: process.env.FROM_NAME || 'NammaSuraksha'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    logDir: path.join(__dirname, '../logs'),
    maxSize: '20m',
    maxFiles: '14d'
  },

  // Socket.IO Configuration
  socketIO: {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  }
}; 