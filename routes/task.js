const express = require("express");
const router = express.Router();
const Joi = require("joi");
const createError = require("http-errors");
const { decodeToken, userIsAuthorized } = require("../middleware/auth");

/**
 * POST to /task to create a new task
 */
router.post("/", decodeToken, async (req, res, next) => {
  const { body, decoded } = req;
  const { error } = validatetask(body);
  if (error) return next(createError(400, error.details[0].message));

  /**
   *    Attempt to create the task
   */

  // const task = someDbCall()

  /**
   *    Return success message
   */
  res.status(201).send(task);
});

const taskSchema = Joi.compile({
  name: Joi.string().required()
});
function validatetask(task) {
  return Joi.validate(task, taskSchema);
}

module.exports = router;
