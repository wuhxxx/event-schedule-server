// Bring in express, body parser and mongoose
const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// Define the port to listen
const PORT = 3000;

// Initiate app and use bodypaser middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// retrieve DB url and connect
const dbURL = require("./config/keys").mongoURL;
mongoose
    .connect(
        dbURL,
        { useNewUrlParser: true }
    )
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// Start server and listen on the specific port
app.listen(PORT, () => {
    console.log(`Server starts Listening on port ${PORT}`);
});
