const express = require("express");
const router = express.Router();
const Joi = require("joi");
const createError = require("http-errors");

const { Project, Task } = require("../data");
const {
  decodeToken,
  userIsAuthorized,
  userHasPermission
} = require("../middleware/auth");
const taskRouter = require("./task");

/**
    decode auth token before passing request to HTTP method handler
*/

router.use(decodeToken);

/**
 * GET to /project/:project_id to retrieve a full project tree
 */

router.get(
  "/:project_id",
  userHasPermission("READ"),
  async (req, res, next) => {
    const project = await Project.findById(req.params.project_id);

    res.json({
      title: project.title,
      id: project.id,
      tree: (await project.generateProjectTree()) || null
    });
  }
);

/**
 * POST to /project to create a new project
 */
router.post("/", async (req, res, next) => {
  const { body, decoded } = req;
  const { error } = validateProject(body);
  if (error) return next(createError(400, error.details[0].message));

  /**
   *    Attempt to create the project
   */

  const project = await Project.create({ title: req.body.title });

  /**
   *    Return success message
   */
  res.status(201).send(project);
});

/**
 * DELETE to /project/:project_id to delete a project
 */

router.delete(
  "/:project_id",
  userHasPermission("ADMIN"),
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
  userHasPermission("EDIT"),
  async (req, res, next) => {
    // Ensure that the update is valid
    const { error } = validateProject(req.body);
    if (error) return next(createError(400, error.details[0].message));

    // Overwrite fields on project document
    const project = await Project.findById(req.params.project_id);

    Object.assign(project, req.body);

    res.status(204).send("project updated");
  }
);

/**
 *  Delegate routing of /:project_id/tasks path to taskRouter
 */
router.use("/:project_id/tasks", taskRouter);

const projectSchema = Joi.compile({
  title: Joi.string().required()
});

function validateProject(project) {
  return Joi.validate(project, projectSchema);
}

module.exports = router;
