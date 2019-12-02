const Project = require("../data/project");
const { permissions } = require("../constants");

async function checkPermission(userId, projectId, requiredPermission) {
  const project = await Project.findById(projectId).populate();

  return project.permissions.some(
    permission =>
      permission.user === userId &&
      permissionIsSufficient(requiredPermission, permission.level)
  );
}

function permissionIsSufficient(requiredPermission, actualPermission) {
  return (
    permissions.indexOf(requiredPermission) >=
    permissions.indexOf(actualPermission)
  );
}

module.exports = { checkPermission };
