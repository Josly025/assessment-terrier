const express = require("express");
const mysql = require("mysql");
// mysql://b0271aae1e7595:0ccbecc9@us-cdbr-east-04.cleardb.com/heroku_7b5ec50f113ac11?reconnect=true
const expressLayouts = require("express-ejs-layouts");
// Requiring module
const csvtojson = require("csvtojson");

//app variable for express
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8081;

///CSS vary for EJS
const fs = require("fs");
const myCss = {
  style: fs.readFileSync("./public/css/style.css", "utf8"),
};

//ejs middlewearLayouts
app.use(expressLayouts);
app.set("view engine", "ejs");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//ROUTES!!! - index --controllers MVC
// let routes = require("./routes/index");
// const { RSA_NO_PADDING } = require("constants");
// app.use(routes);

/////// Importing mysql and csvtojson packages   ////////
// CSV file name -- as variables
const locationsCSV = "./csv/locations.csv";
const techniciansCSV = "./csv/technicians.csv";
const workordersCSV = "./csv/work_orders.csv";

// Establish connection to the database
let con = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  port: 3306,
  user: "b0271aae1e7595",
  password: "0ccbecc9",
});
// mysql://b0271aae1e7595:0ccbecc9@us-cdbr-east-04.cleardb.com/heroku_7b5ec50f113ac11?reconnect=true
con.connect((err) => {
  if (err) return console.error("error: CANT CONNECT" + err.message);
  // console.log("Connected!");
  //Create Database
  con.query("DROP DATABASE IF EXISTS heroku_7b5ec50f113ac11", (err, drop) => {
    console.log("deleted database --> heroku_7b5ec50f113ac11");
  });
  con.query("CREATE DATABASE heroku_7b5ec50f113ac11", function (err, result) {
    if (err) throw err;
    console.log("Database Created --> heroku_7b5ec50f113ac11");
    createTables();
  });
});

let conTwo = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  port: 3306,
  user: "b0271aae1e7595",
  password: "0ccbecc9",
  database: "heroku_7b5ec50f113ac11",
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
        // insertCSV();
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
            // console.log(results);
          }
        });
      }
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
            // console.log(results);
          }
        });
      }
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
            // console.log(results);
          }
        });
      }
    });

  //Get all employees
}

app.get("/", (req, res) => {
  conTwo.query(
    "SELECT technicians.id, technicians.name, work_orders.technician_id, work_orders.location_id, work_orders.time, work_orders.duration, work_orders.price, locations.id, locations.name, locations.city " +
      "FROM technicians " +
      "INNER JOIN work_orders " +
      "ON technicians.id=work_orders.technician_id " +
      "INNER JOIN locations " +
      "ON locations.id=work_orders.location_id " +
      "ORDER BY " +
      "technicians.id, work_orders.time",
    (err, results) => {
      if (err) throw err;
      let orderData = results;
      console.log(orderData);
      //Render Home page and show data
      res.render("home", {
        orderData: orderData,
      }),
        {
          myCss: myCss,
        };
    }
  );
});

/////
// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
