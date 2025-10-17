const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const log = (level, message, data = null) => {
  const logMessage = `[${getTimestamp()}] [${level}] ${message}`;
  const fullMessage = data ? `${logMessage} ${JSON.stringify(data)}` : logMessage;
  
  console.log(fullMessage);
  
  // Write to file if in production
  if (process.env.NODE_ENV === 'production') {
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(logFile, `${fullMessage}\n`);
  }
};

const info = (message, data = null) => log('INFO', message, data);
const error = (message, data = null) => log('ERROR', message, data);
const warn = (message, data = null) => log('WARN', message, data);
const debug = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    log('DEBUG', message, data);
  }
};

module.exports = {
  info,
  error,
  warn,
  debug
};
