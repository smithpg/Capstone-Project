const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const helpers = require("../helpers/authHelpers");

module.exports.userIsLoggedIn = function(req, res, next) {
  console.log("in orig userIsLoggedIn");

  if (req.user) {
    next();
  } else {
    next(createError(401, "Log in first"));
  }
};

module.exports.userHasPermission = function(permissionLevel) {
  return async function(req, res, next) {
    console.log(req.user);
    if (
      await helpers.checkPermission(
        req.user._id,
        req.params.project_id, // Middleware expects project id as route param
        permissionLevel
      )
    ) {
      return next();
    } else {
      return next(createError(403, "Unauthorized"));
    }
  };
};
