const express = require("express");
const mysql = require("mysql");

const expressLayouts = require("express-ejs-layouts");
// Requiring module
const csvtojson = require("csvtojson");

//app variable for express
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
app.use(express.static(__dirname + "/public"));
//ROUTES!!! - index routes
app.use("/", require("./routes/index.js"));

/////// Importing mysql and csvtojson packages

// Establish connection to the database
let con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Grantjos12",
  database: "pest_scheduler",
});

// CSV file name -- as variables
const locationsCSV = "./csv/locations.csv";
const techniciansCSV = "./csv/technicians.csv";
const workordersCSV = "./csv/work_orders.csv";

con.connect((err) => {
  if (err) return console.error("error: CANT CONNECT" + err.message);

  con.query("DROP TABLE locations", (err, drop) => {
    // Query to create table "locations"
    let createStatament =
      "CREATE TABLE locations(id int, " + "name char(50), city char(30))";

    // Creating table "locations"
    con.query(createStatament, (err, drop) => {
      if (err) console.log("ERROR: ", err);
    });
  });
});

csvtojson()
  .fromFile(locationsCSV)
  .then((source) => {
    // Fetching the data from each row
    // and inserting to the table "locations"
    for (var i = 0; i < source.length; i++) {
      let id = source[i]["id"],
        name = source[i]["name"],
        city = source[i]["city"];

      let insertStatement = `INSERT INTO locations values(?, ?, ?)`;
      let items = [id, name, city];

      // Inserting data of current row
      // into database
      con.query(insertStatement, items, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert item at row ", i + 1);
          return console.log(err);
        } else {
          console.log("All items stored into database successfully");
          console.log(results);
        }
      });
    }

    con.query("SELECT * FROM locations", function (error, results, fields) {
      console.log(results);
    });
  });

/////
// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
