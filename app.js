const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { projectRouter } = require("./routes");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/projects", projectRouter);

app.use(cookieParser());

app.get("/login", (req, res) => {
  res.redirect("/");
});

// app.get("/", (req, res, next) => {
//   if (req.session.token) {
//     res.cookie("token", req.session.token);
//     res.redirect("/projects");
//   } else {
//     res.cookie("token", "");
//     res.redirect("/auth/google");
//   }
// });

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    res.send(req.user);
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session.token = null;
  res.redirect("/");
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

module.exports = app;
