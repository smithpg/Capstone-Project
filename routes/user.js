const router = require("express").Router();

const Joi = require("joi");
const createError = require("http-errors");

const { User, Project } = require("../data");

router.post("/login", async (req, res, next) => {
  const { googleId, firstname, lastname } = req.body.profile;

  // Use the user's google id to retrieve relevant user document,
  // or create a new one if this is the user's first sign-in.
  let userDocument;
  try {
    userDocument = await User.find({ googleId });
  } catch (error) {
    userDocument = await User.create({
      firstname,
      lastname,
      googleId
    });
  }

  // Return an object containing user details, plus an array of all
  // projects the user is able to access
  // TODO: Efficiency of this is questionable. Refactor?

  const accessibleProjects = await userDocument.getAccessibleProjects();

  res.status(200).send({
    id: userDocument.id,
    projects: accessibleProjects
  });
});

module.exports = router;
