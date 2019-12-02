const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const apiRouter = require("./routes");

const app = express();

//Open Database in memory
// let db = new sqlite3.Database('./db/perro.db', (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Connected to the in-memory SQlite database.');
// });

// //SQL Statement
// let sql = `SELECT * FROM Users`;

// //Log statement to console
// db.all(sql, [], (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// // close the database connection
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "client/build")));

app.use("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/public/index.html"));
});

module.exports = app;
