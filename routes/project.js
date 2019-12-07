const express = require("express");
const router = express.Router();
const Joi = require("joi");
const createError = require("http-errors");

const { Project, Task, Permission } = require("../data");
const authMiddleware = require("../middleware/auth");
const taskRouter = require("./task");
const permissionRouter = require("./permission");

/**
 * GET to /project to retrieve a list of projects the logged in
 * user can access
 */

router.get("/", authMiddleware.userIsLoggedIn, async (req, res, next) => {
  res.json(await req.user.getAccessibleProjects());
});

/**
 * GET to /project/:project_id to retrieve a full project tree
 */

router.get(
  "/:project_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("READ"),
  async (req, res, next) => {
    const project = await Project.findById(req.params.project_id);

    res.json({
      title: project.title,
      id: project.id,
      tree: await project.generateProjectTree()
    });
  }
);

/**
 * POST to /project to create a new project
 */
router.post("/", authMiddleware.userIsLoggedIn, async (req, res, next) => {
  const { error } = validateProject(req.body);
  if (error) return next(createError(400, error.details[0].message));

  /**
   *    Attempt to create the project
   */

  const project = await Project.create({ title: req.body.title });

  /**
   *    Grant admin permission to creating user
   */

  await Permission.create({
    project: project.id,
    user: req.user.id,
    level: "ADMIN"
  });

  /**
   *    Return success message
   */
  res.status(201).send({ permission: "ADMIN", project });
});

/**
 * DELETE to /project/:project_id to delete a project
 */

router.delete(
  "/:project_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    await Project.findById(req.params.project_id).then(res => res.remove());

    res.status(204).send("project deleted");
  }
);

/**
 * PUT to /project/:project_id to update a project
 */

router.put(
  "/:project_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("EDIT"),
  async (req, res, next) => {
    // Ensure that the update is valid
    const { error } = validateProject(req.body);
    if (error) return next(createError(400, error.details[0].message));

    // Overwrite fields on project document
    const project = await Project.findById(req.params.project_id);

    Object.assign(project, req.body);

    await project.save();

    res.status(204).send("project updated");
  }
);

/**
 *  Delegate routing of /:project_id/tasks path to taskRouter
 */
router.use("/:project_id/tasks", taskRouter);

/**
 *  Delegate routing of /permissions path to permissionsRouter
 */
router.use("/:project_id/permissions", permissionRouter);

const projectSchema = Joi.compile({
  title: Joi.string().required()
});

function validateProject(project) {
  return Joi.validate(project, projectSchema);
}

module.exports = router;
