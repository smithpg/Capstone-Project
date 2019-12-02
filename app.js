const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { projectRouter } = require("./routes");

const app = express();
const passport = require('passport');
const auth = require('./auth');
const cookieSession = require('cookie-session');

auth(passport);
app.use(passport.initialize());


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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/projects", projectRouter);



app.use(cookieSession({
    name: 'session',
    keys: ['SECRECT KEY'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());

app.get("/login", (req, res) => {
	res.redirect('/');
})

app.get("/", (req, res, next) => {
	if (req.session.token) {
        res.cookie('token', req.session.token);
        res.redirect('/projects');
    } else {
        res.cookie('token', '')
        res.redirect('/auth/google');
    }
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        //console.log(req.user.token);
        req.session.token = req.user.token;
        res.redirect('/projects');
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    req.session.token = null;
    res.redirect('/');
});

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

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/public/index.html"));
// });

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
