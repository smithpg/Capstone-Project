const apiRouter = require("express").Router();

apiRouter.use("/projects", require("./project"));

module.exports = apiRouter;
