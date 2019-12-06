const mongoose = require("mongoose");
const { DB_PASSWORD, DB_USER, DB_NAME, DB_DOMAIN } = process.env;

const connectionString =
  process.env.NODE_ENV !== "production"
    ? "mongodb://localhost:27017/perro"
    : `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_DOMAIN}/${DB_NAME}`;

module.exports.connection = mongoose.connect(connectionString, {
  useNewUrlParser: true, // Use new url parser instead of default deprecated one
  useCreateIndex: true, //ensure index is deprecated use createindex instead.
  keepAlive: true,
  useUnifiedTopology: true
});

module.exports.Task = require("./task");
module.exports.Project = require("./project");
module.exports.Report = require("./report");
module.exports.Permission = require("./permission");
