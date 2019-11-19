const express = require("express");
const router = express.Router();
const Joi = require("joi");
const createError = require("http-errors");

const { Task, Report } = require("../data");

const { userHasPermission } = require("../middleware/auth");

/**
 * POST to /task to create a new task
 */
router.post("/", userHasPermission("EDIT"), async (req, res, next) => {
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
});

router.put("/:task_id", userHasPermission("EDIT"), async (req, res, next) => {
  const { error } = validatetask(req.body);
  if (error) return next(createError(400, error.details[0].message));

  try {
    //Attempt to update the task
    const task = await Task.findByIdAndUpdate(req.params.task_id, req.body, {
      new: true
    });

    res.status(204).json(task);
  } catch (error) {
    return next(createError(500, error));
  }
});

router.delete(
  "/:task_id",
  userHasPermission("ADMIN"),
  async (req, res, next) => {
    const task = Task.findById(req.params.task_id);

    task.remove();

    res.status(204).send("Task deleted");
  }
);

router.post(
  "/:task_id/reports",
  userHasPermission("EDIT"),
  async (req, res, next) => {
    await Report.create({ ...req.body, task: req.params.task_id });
    res.status(201).send({ success: true });
  }
);

const taskSchema = Joi.compile({
  title: Joi.string().required()
});
function validatetask(task) {
  return Joi.validate(task, taskSchema);
}

module.exports = router;
