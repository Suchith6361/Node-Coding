import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    // Console
    new winston.transports.Console(),

    // Save logs to a file
    new winston.transports.File({
      filename: "logs/app.log",
    }),
  ],
});

export default logger;