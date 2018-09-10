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
const userRoutes = require("./routes/user.js");

// Initiate app and use body-parser and passport auth middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(auth.initialize());

// Connect to MongoDB
mongoose.set("useCreateIndex", true); // get rid of collection.ensureIndex DeprecationWarning
mongoose
    .connect(
        config.mongoDBURL,
        { useNewUrlParser: true }
    )
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// Use routes
app.use("/user", userRoutes);

// Start server and listen on the specific port
app.listen(config.PORT, () => {
    console.log(`Server starts Listening on port ${config.PORT}`);
});
