const mongoose = require("mongoose");
// { DB_PASSWORD, DB_USER, DB_NAME } = process.env;

// const connectionString =
//     process.env.NODE_ENV !== "production"
//         ? "mongodb://localhost:27017/perro"
//         : `mongodb://${DB_USER}:${DB_PASSWORD}@{DOMAIN}/${DB_NAME}`;

const connectionString = "mongodb://localhost:27017/perro";

module.exports.connection = mongoose.connect(connectionString, {
  useNewUrlParser: true, // Use new url parser instead of default deprecated one
  useCreateIndex: true, //ensure index is deprecated use createindex instead.
  keepAlive: true,
  useUnifiedTopology: true
});

module.exports.Task = require("./task");
module.exports.Project = require("./project");
module.exports.Report = require("./report");
