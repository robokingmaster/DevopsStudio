    // logger.js
    const winston = require('winston');
    const { combine, timestamp, label, printf } = winston.format;

    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    // Define log levels and their corresponding numerical values
    const levels = {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        trace: 4
    };

    const logger = winston.createLogger({
        levels: levels, // Use custom levels if needed
        level: process.env.APP_LOG_LEVEL || 'info', // Set default level from environment variable or 'info'
        format: combine(
            label({ label: 'LOG' }),
            timestamp(),
            myFormat
        ),        
        // format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.simple() // Or other desired format like winston.format.simple()
        // ),
        transports: [
            new winston.transports.Console(), // Log to console
            // Add other transports like file transport if needed
            // new winston.transports.File({ filename: 'combined.log' })
        ]
    });

    module.exports = logger;