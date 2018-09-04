// Bring in express, body parser and mongoose
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// Bring in server config
const config = require("./config/serverConfig");

// Initiate app and use bodypaser middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(
        config.mongoDBURL,
        { useNewUrlParser: true }
    )
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// Start server and listen on the specific port
app.listen(config.PORT, () => {
    console.log(`Server starts Listening on port ${config.PORT}`);
});
