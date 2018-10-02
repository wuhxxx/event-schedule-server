// Load environment variables
require("dotenv").config();

// Bring in express, body parser, mongoose and passport authenticator
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    auth = require("./auth/auth.js");

// Bring in server config
const config = require("./config/serverConfig.js");

// Bring in routes
const userRouter = require("./routes/user.js"),
    eventRouter = require("./routes/event.js");

// Bring in error handlers
const {
    validationErrorHandler,
    userErrorHandler,
    eventErrorHandler,
    serverErrorHandler
} = require("./util/errorHandlers.js");

// Bring in loggers
const { loggerHelper, requestLogger, errorLogger } = require("./util/loggers");

// Initiate app and use body-parser and passport auth middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(auth.initialize());

// Connect to MongoDB
// get rid of "collection.ensureIndex" DeprecationWarning
mongoose.set("useCreateIndex", true);
// get rid of "collection.findAndModify" DeprecationWarning
mongoose.set("useFindAndModify", false);
mongoose
    .connect(
        config.mongoDBURL,
        { useNewUrlParser: true }
    )
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// use logger
app.use(requestLogger);

// use routes
app.use("/user", userRouter);
app.use("/event", eventRouter);

//app.all("*", (req, res) => {});

// use logger helper
app.use(loggerHelper);

// use error handlers and error logger, server error handler should be in the last
app.use(validationErrorHandler);
app.use(userErrorHandler);
app.use(eventErrorHandler);
app.use(errorLogger);
app.use(serverErrorHandler);

// Start server and listen on the specific port
app.listen(config.PORT, () => {
    console.log(`Server starts Listening on port ${config.PORT}`);
});
