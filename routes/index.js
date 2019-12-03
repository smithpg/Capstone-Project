const apiRouter = require("express").Router();

apiRouter.use("/projects", require("./project"));
apiRouter.use("/users", require("./user"));

module.exports = apiRouter;
