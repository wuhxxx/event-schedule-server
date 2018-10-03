// express middleware loggers, log errors and every request.
// load winston, winston-console-formatter, cli-color and custom date time formatter
const winston = require("winston"),
    wcf = require("winston-console-formatter"),
    clc = require("cli-color"),
    timeFormatter = require("./dateTimeFormatter.js");

// message colors for each level
const { formatter } = wcf({
    colors: {
        silly: clc.blue,
        debug: clc.cyan,
        info: clc.green,
        warn: clc.yellow,
        error: clc.red,
        verbose: clc.magenta
    }
});

// winston logger and set up formatter
const logger = new winston.Logger({
    level: "silly"
});
logger.add(winston.transports.Console, {
    formatter,
    timestamp: function() {
        return timeFormatter.format(new Date());
    }
});

// Error response logging helper, attach error detail to res
const loggerHelper = (err, req, res, next) => {
    res.errorType = err.name;
    res.errorMessage = err.message;
    next(err);
};

// Request logger middleware, decorate res.end to get request response time
const requestLogger = (req, res, next) => {
    const receiveTime = new Date();
    let oldEnd = res.end;
    // Arrow function has no arguments, although this can be solved by using rest parameter,
    // still better to use normal function definition according to MDN as res.end is not anonymous
    res.end = function() {
        // response time
        const responseTime = new Date() - receiveTime;

        // response
        let response = "OK";
        if (res.statusCode !== 200 && res.errorType) response = res.errorType;
        else if (res.statusCode !== 200) response = "URLNotFound";

        // log request
        logger.info(
            `${req.method} ${req.originalUrl} -> ${
                res.statusCode
            } ${response} in ${responseTime}ms`
        );
        // assign old res.end back
        res.end = oldEnd;
        return oldEnd.apply(res, arguments);
    };
    next();
};

// Server error logger middleware, log error when internal server error occurs
const errorLogger = (err, req, res, next) => {
    logger.error(err.toString(), {
        stack: err.stack
    });
    next(err);
};

module.exports = { logger, loggerHelper, requestLogger, errorLogger };
