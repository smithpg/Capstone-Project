const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const apiRouter = require("./routes");

const app = express();
const passport = require("passport");
const auth = require("./auth2");

auth(passport);

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("++++++++++");
  console.log(req.body);
  console.log("++++++++++");

  next();
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/",
    successRedirect: "http://localhost:3000/projects"
  }),
  (req, res) => {
    //console.log(req.body);
    //console.log(req.user);
    res.send(req.user);
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session.token = null;
  res.redirect("/");
});

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

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/public/index.html"));
// });

module.exports = app;
