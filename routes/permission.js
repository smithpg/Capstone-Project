const router = require("express").Router({ mergeParams: true });

const Joi = require("joi");
const createError = require("http-errors");

const authMiddleware = require("../middleware/auth");
const { User, Permission } = require("../data");

router.post(
  "/",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    try {
      const { userEmail, permissionLevel } = req.body;

      // Look for user with matching email
      const user = await User.findOne({ email: userEmail });

      // Create the specified permission
      const newPermission = await Permission.create({
        user: user.id,
        project: req.params.project_id,
        level: permissionLevel
      });

      res
        .status(200)
        .send({ ...newPermission, user: { ...newPermission.user, email } });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:permission_id",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    try {
      const targetPermission = await Permission.findById(
        req.params.permission_id
      );

      targetPermission.remove();

      res.status(200).send({
        message: "success"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  authMiddleware.userIsLoggedIn,
  authMiddleware.userHasPermission("ADMIN"),
  async (req, res, next) => {
    console.log("in get perm route");

    try {
      const permissions = await Permission.find({
        project: req.params.project_id
      }).populate("user", "email");

      res.status(200).send(permissions);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
