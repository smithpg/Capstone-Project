const Permission = require("../data/permission");
const { permissions } = require("../constants");

async function checkPermission(userId, projectId, requiredPermission) {
  const permissions = await Permission.find({
    project: projectId,
    user: userId
  });

  return (
    permissions &&
    permissions.some(permission =>
      permissionIsSufficient(requiredPermission, permission.level)
    )
  );
}

function permissionIsSufficient(requiredPermission, actualPermission) {
  return (
    permissions.indexOf(requiredPermission) >=
    permissions.indexOf(actualPermission)
  );
}

module.exports = { checkPermission };
