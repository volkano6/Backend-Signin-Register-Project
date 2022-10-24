const winston = require('winston');


const login_logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: './log_files/login.log', level: 'error'}),
    new winston.transports.File({ filename: './log_files/login.log'}),
  ],
});

const register_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: './log_files/register.log', level: 'error'}),
      new winston.transports.File({ filename: './log_files/register.log'}),
    ],
  });

  const delete_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: './log_files/delete.log', level: 'error'}),
      new winston.transports.File({ filename: './log_files/delete.log'}),
    ],
  });

  const update_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: './log_files/update.log', level: 'error'}),
      new winston.transports.File({ filename: './log_files/update.log'}),
    ],
  });

module.exports = {login_logger, register_logger, delete_logger, update_logger}