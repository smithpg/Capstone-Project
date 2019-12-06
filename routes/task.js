const express = require("express");
const router = express.Router();
const Joi = require("joi");
const createError = require("http-errors");

const { Task, Report } = require("../data");

const authMiddleware = require("../middleware/auth");

/**
 * POST to /task to create a new task
 */
router.post(
  "/",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("EDIT"),
  async (req, res, next) => {
    const { error } = validatetask(req.body);
    if (error) return next(createError(400, error.details[0].message));

    /**
     *    Attempt to create the task
     */

    const newTask = await Task.create({
      ...req.body,
      project: req.params.project_id
    });

    /**
     *    Return success message
     */
    res.status(201).send(newTask);
  }
);

router.put(
  "/:task_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("EDIT"),
  async (req, res, next) => {
    const { error } = validatetask(req.body);
    if (error) return next(createError(400, error.details[0].message));

    try {
      //Attempt to update the task
      const task = await Task.findById(req.params.task_id);

      Object.assign(task, req.body);

      await task.save();

      res.status(204).send();
    } catch (error) {
      return next(createError(500, error));
    }
  }
);

router.delete(
  "/:task_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    const task = Task.findById(req.params.task_id);

    task.remove();

    res.status(204).send("Task deleted");
  }
);

router.post(
  "/:task_id/reports",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("EDIT"),
  async (req, res, next) => {
    await Report.create({ ...req.body, task: req.params.task_id });
    res.status(201).send({ success: true });
  }
);

router.put(
  "/:task_id/reports/:report_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("EDIT"),
  async (req, res, next) => {
    await Report.findByIdAndUpdate(req.params.report_id, req.body);
    res.status(204).send();
  }
);

const taskSchema = Joi.compile({
  title: Joi.string().required()
});
function validatetask(task) {
  return Joi.validate(task, taskSchema);
}

module.exports = router;
