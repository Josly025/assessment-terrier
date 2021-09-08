const express = require("express");
const mysql = require("mysql");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8081;

//ejs middlewearLayouts
app.use(expressLayouts);
app.set("view engine", "ejs");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES!!! - index routes
app.use("/", require("./routes/index.js"));

/////
// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
