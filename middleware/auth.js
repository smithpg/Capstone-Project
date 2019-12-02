const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const helpers = require("../helpers/authHelpers");

module.exports.userHasPermission = function(permissionLevel) {
  return async function(req, res, next) {
    if (
      await helpers.checkPermission(
        req.decoded._id,
        req.params.project_id,
        permissionLevel
      )
    ) {
      return next();
    } else {
      return next(createError(403, "Unauthorized"));
    }
  };
};

module.exports.decodeToken = async function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    /**
     *  Attempt to decode the token and attach to request object
     */
    req.decoded = await jwt.verify(token);
    next();
  } catch (error) {
    return next(createError(401, "Sign in first."));
  }
};
