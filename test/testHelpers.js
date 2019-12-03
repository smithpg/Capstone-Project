const mongoose = require("mongoose");
const Task = require("../data/task");
const Project = require("../data/project");
const Report = require("../data/report");
const User = require("../data/user");
const Permission = require("../data/permission");
const connectionString = "mongodb://localhost:27017/perro";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true, // Use new url parser instead of default deprecated one
    useCreateIndex: true, //`ensureIndex` is deprecated, use `createIndex` instead.
    keepAlive: true,
    useUnifiedTopology: true
  })
  .catch(console.err);

module.exports.teardownDb = function() {
  return mongoose.connection.db.dropDatabase();
};

module.exports.createDummyTask = async function() {
  const MAX_TOTAL_TASKS_IN_SUBTREE = 5;
  const MAX_CHILDREN_OF_TASK = 2;

  // Generate some fake tasks
  const rootTask = await Task.create({
    title: "root",
    parent: null
  });
  const parentQueue = [rootTask.id];
  let totalTasksCreated = 1;

  while (totalTasksCreated < MAX_TOTAL_TASKS_IN_SUBTREE) {
    let currentParent = parentQueue.pop();
    for (
      let numChildren = 0;
      numChildren < MAX_CHILDREN_OF_TASK;
      numChildren++
    ) {
      const task = await Task.create({
        title: "test",
        parent: currentParent
      });

      parentQueue.unshift(task.id);
      totalTasksCreated++;
    }
  }

  return rootTask;
};

async function createDummyProject(maxTotal = 15, maxChildren = 3) {
  const createdProject = await Project.create({ title: "abc" });

  // Generate some fake tasks
  const parentQueue = [null];
  let totalTasksCreated = 0;
  while (totalTasksCreated < maxTotal) {
    let currentParent = parentQueue.pop();
    for (let i = 0; i < maxChildren; i++) {
      const task = await Task.create({
        title: "test",
        parent: currentParent,
        project: createdProject.id
      });

      parentQueue.unshift(task.id);
      totalTasksCreated++;
    }
  }

  return {
    id: createdProject._id,

    delete: function() {
      createdProject.remove();
    },

    doc: createdProject,

    descendentTaskId: await Task.findOne({
      project: createdProject.id,
      parent: null
    }).then(res => res.id)
  };
}

let nextGoogleId = 11111111;
async function createDummyUser() {
  const userDocument = await User.create({
    firstname: "John",
    lastname: "Doe",
    googleId: nextGoogleId++
  });

  return userDocument.id;
}

function createDummyReport(taskId) {
  return Report.create({
    task: taskId,
    date: Date.now(),
    remaining: 10,
    progress: 10
  });
}

async function seedDB() {
  // Create test user
  const testUserId = await createDummyUser();

  // Create a project and assign it to test user
  const { id: testProjectId } = await createDummyProject();

  await Permission.create({
    user: testUserId,
    project: testProjectId,
    level: "ADMIN"
  });
}

module.exports.seedDB = seedDB;

module.exports.createDummyReport = createDummyReport;

module.exports.createDummyProject = createDummyProject;

module.exports.countNodes = tree => {
  let total = 0;

  tree.forEach(_count);

  return total;

  function _count(node) {
    if (node.children.length !== 0) {
      node.children.forEach(_count);
    }
    total++;
    return;
  }
};

module.exports.delay = duration =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
