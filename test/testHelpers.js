const mongoose = require("mongoose");
const Task = require("../data/task");
const Project = require("../data/project");
const Report = require("../data/report");
const User = require("../data/user");
const Permission = require("../data/permission");
const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports.initDB = function() {
  const mongoServer = new MongoMemoryServer();

  return mongoServer.getConnectionString().then(mongoUri => {
    const mongooseOpts = {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on("error", e => {
      if (e.message.code === "ETIMEDOUT") {
        console.log(e);
        mongoose.connect(mongoUri, mongooseOpts);
      }
      console.log(e);
    });

    mongoose.connection.once("open", () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`);
    });
  });
};

module.exports.deleteCollections = async function() {
  const allCollections = await mongoose.connection.db.collections();

  await Promise.all(allCollections.map(collection => collection.drop()));
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

let nextGoogleId = 333333;
async function createDummyUser() {
  const userDocument = await User.create({
    firstname: "John",
    lastname: "Doe",
    googleId: nextGoogleId++,
    email: `testUser${nextGoogleId}@gmail.com`
  });

  return userDocument;
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
  /**
   *  Creates several instances of Projects and Users, then assigns permissions
   *  such that we have an instance of each type of user -> project
   *  relationship (i.e. user is unauthorized, user has READ, user has ADMIN)
   */

  const testUser1 = await createDummyUser();
  const testUser2 = await createDummyUser();
  const testUser3 = await createDummyUser();

  const testProject1 = await createDummyProject();
  const testProject2 = await createDummyProject();

  await Permission.create({
    user: testUser1.id,
    project: testProject1.id,
    level: "ADMIN"
  });
  await Permission.create({
    user: testUser1.id,
    project: testProject2.id,
    level: "ADMIN"
  });

  await Permission.create({
    user: testUser2.id,
    project: testProject1.id,
    level: "READ"
  });

  // return object containing the various documents
  return {
    adminUser: testUser1,
    readUser: testUser2,
    userWithNoPermissions: testUser3,
    project: testProject1
  };
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

module.exports.clearRequireCache = function() {
  Object.keys(require.cache).forEach(key => delete require.cache[key]);
};
