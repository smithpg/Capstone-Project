const router = require("express").Router();

const Joi = require("joi");
const createError = require("http-errors");

const authMiddleware = require("../middleware/auth");
const { User, Project } = require("../data");

router.post(
  "/grant-permission",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    try {
      const { userEmail, projectId, permissionLevel } = req.body;

      // Look for user with matching email
      User.find();

      // Create the specified permission
      Permission.create(req.body);

      res.status(200).send({
        message: "success"
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
