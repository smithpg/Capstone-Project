const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { Project } = require("../data");

const { permissions } = require("../constants");

module.exports.userHasPermission = () => (req, res, next) => next(); //Hasty mock

// module.exports.userHasPermission = function(permissionLevel) {
//   return async function(req, res, next) {
//     if (
//       await userHasPermission(
//         req.decoded._id,
//         req.params.project_id,
//         permissionLevel
//       )
//     ) {
//       return next();
//     } else {
//       return next(createError(403, "Unauthorized"));
//     }
//   };
// };

module.exports.decodeToken = async function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    /**
     *  Attempt to decode the token and attach to request object
     */
    req.decoded = await jwt.decode(token);
    next();
  } catch (error) {
    return next(createError(401, "Sign in first."));
  }
};

module.exports.userIsAuthorized = function(req, res, next) {
  /**
   *  Compare id stored in JWT to id in request parameter
   */

  const {
    params: { userId },
    decoded
  } = req;

  console.log("Userid and 403", userId, decoded._id);
  if (userId !== decoded._id) {
    return next(createError(403, "Unauthorized."));
  } else return next();
};

async function userHasPermission(userId, projectId, permissionLevel) {
  const project = await Project.findById(projectId).populate();

  return project.permissions.some(
    permission =>
      permission.user === userId &&
      permissionIsSufficient(permission.level, permissionLevel)
  );
}

function permissionIsSufficient(requiredPermission, actualPermission) {
  return (
    permissions.indexOf(requiredPermission) >=
    permissions.indexOf(actualPermission)
  );
}
