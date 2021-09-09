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

// CSV file name -- as variables
const locationsCSV = "./csv/locations.csv";
const techniciansCSV = "./csv/technicians.csv";
const workordersCSV = "./csv/work_orders.csv";

/////// Importing mysql and csvtojson packages

// Establish connection to the database
let con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Grantjos12",
});

con.connect((err) => {
  if (err) return console.error("error: CANT CONNECT" + err.message);
  console.log("Connected!");
  //Create Database
  con.query("DROP DATABASE IF EXISTS pest_scheduler", (err, drop) => {
    console.log("deleted database --> pest_scheduler");
  });
  con.query("CREATE DATABASE pest_scheduler", function (err, result) {
    if (err) throw err;
    console.log("Database Created --> pest_scheduler");
    createTables();
  });
});

let conTwo = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Grantjos12",
  database: "pest_scheduler",
});

function createTables() {
  conTwo.connect((err) => {
    if (err) return console.error("error: CANT CONNECT" + err.message);

    //CREATE TABLE LOCATIONS
    conTwo.query("DROP TABLE IF EXISTS locations", (err, drop) => {
      // Query to create table "locations"
      let createStatamentLoc =
        "CREATE TABLE locations(id int, " + "name char(50), city char(30))";

      // Creating table "locations"
      conTwo.query(createStatamentLoc, (err, drop) => {
        if (err) console.log("ERROR: ", err);
        console.log("Table created --> locations");
        insertCSV();
      });
    });

    conTwo.query("DROP TABLE IF EXISTS technicians", (err, drop) => {
      // Query to create table "technicians"
      let createStatamentTech =
        "CREATE TABLE technicians(id int, " + "name char(50))";

      // Creating table "locations"
      conTwo.query(createStatamentTech, (err, drop) => {
        if (err) console.log("ERROR: ", err);
        console.log("Table created --> technicians");
      });
    });

    conTwo.query("DROP TABLE IF EXISTS work_orders", (err, drop) => {
      // Query to create table "word_orders"
      let createStatamentWork =
        "CREATE TABLE work_orders(id int, " +
        "technician_id int, location_id int, time datetime, duration int, price int)";

      // Creating table "locations"
      conTwo.query(createStatamentWork, (err, drop) => {
        if (err) console.log("ERROR: ", err);
        console.log("Table created --> work_orders");
        //CALLBACK insertCSV
        insertCSV();
      });
    });
  });
}

function insertCSV() {
  //import Locations CSV
  csvtojson()
    .fromFile(locationsCSV)
    .then((source) => {
      // Fetching the data from each row
      // and inserting to the table "locations"
      for (var i = 0; i < source.length; i++) {
        let Id = source[i]["id"],
          Name = source[i]["name"],
          City = source[i]["city"];

        let insertStatement = `INSERT INTO locations values(?, ?, ?)`;
        let items = [Id, Name, City];

        // Inserting data of current row
        // into database
        conTwo.query(insertStatement, items, (err, results, fields) => {
          if (err) {
            console.log("Unable to insert item at row ", i + 1);
            return console.log(err);
          } else {
            console.log(results);
          }
        });
        console.log("All items stored into database successfully");
      }

      con.query("SELECT * FROM locations", function (error, results, fields) {
        console.log(results);
      });
    });

  //import technicians CSV
  csvtojson()
    .fromFile(techniciansCSV)
    .then((sourceTech) => {
      // Fetching the data from each row
      // and inserting to the table "locations"
      for (var i = 0; i < sourceTech.length; i++) {
        let idTech = sourceTech[i]["id"],
          nameTech = sourceTech[i]["name"];

        let insertStatementTech = `INSERT INTO technicians values(?, ?)`;
        let itemsTech = [idTech, nameTech];

        // Inserting data of current row
        // into database
        conTwo.query(insertStatementTech, itemsTech, (err, results, fields) => {
          if (err) {
            console.log("Unable to insert item at row ", i + 1);
            return console.log(err);
          } else {
            console.log(results);
          }
        });
        console.log("All items stored into database successfully");
      }

      con.query("SELECT * FROM technicians", function (error, results, fields) {
        console.log(results);
      });
    });

  // //import work_orders CSV
  csvtojson()
    .fromFile(workordersCSV)
    .then((sourceWork) => {
      // Fetching the data from each row
      // and inserting to the table "locations"
      for (var i = 0; i < sourceWork.length; i++) {
        let idWork = sourceWork[i]["id"],
          techWork = sourceWork[i]["technician_id"],
          locationWork = sourceWork[i]["location_id"],
          timeWork = sourceWork[i]["time"],
          durationWork = sourceWork[i]["duration"],
          priceWork = sourceWork[i]["price"];

        let insertStatementWork = `INSERT INTO work_orders values(?, ?, ?, ?, ?, ?)`;
        let itemsWork = [
          idWork,
          techWork,
          locationWork,
          timeWork,
          durationWork,
          priceWork,
        ];

        // Inserting data of current row
        // into database
        conTwo.query(insertStatementWork, itemsWork, (err, results, fields) => {
          if (err) {
            console.log("Unable to insert item at row ", i + 1);
            return console.log(err);
          } else {
            console.log(results);
          }
        });
        console.log("All items stored into database successfully");
      }

      con.query("SELECT * FROM work_orders", function (error, results, fields) {
        console.log(results);
      });
    });
}

/////
// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
