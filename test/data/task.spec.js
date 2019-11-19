const helpers = require("../testHelpers");
const Task = require("../../data/task");
const Report = require("../../data/report");

const { expect } = require("chai");

describe("Task instance methods", () => {
  describe("getFullyPopulatedSubtree", () => {
    let dummyTask;
    before(async () => {
      dummyTask = await helpers.createDummyTask();
    });

    after(helpers.teardownDb); // drop everything

    it("should return a populated tree", async () => {
      await dummyTask.getFullyPopulatedSubtree();
    });
  });
});

describe("On creation of a task document", () => {
  let dummyParentTask, dummyChildTask;

  beforeEach(async () => {
    dummyParentTask = await Task.create({ title: "abc" });
    dummyChildTask = await Task.create({
      title: "def",
      parent: dummyParentTask.id
    });
  });

  afterEach(helpers.teardownDb); // drop everything

  it("new task's id should be added to parent task document", async function() {
    // Get a new document instance that will reflect most recent
    // updates
    dummyParentTask = await Task.findById(dummyParentTask.id);

    expect(dummyParentTask.children).to.include(dummyChildTask.id);
  });
});

describe("On deletion of a task document", () => {
  afterEach(helpers.teardownDb); // drop everything
  it("associated reports should also be deleted", async function() {
    let dummyParentTask = await Task.create({ title: "abc" });

    const dummyReport = await Report.create({
      task: dummyParentTask.id,
      date: Date.now(),
      remaining: 10,
      progress: 10
    });

    dummyParentTask = await Task.findById(dummyParentTask.id);

    dummyParentTask.remove();

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        Report.findById(dummyReport.id, (err, res) => {
          try {
            expect(res).to.be.null;
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }, 1000);
    });
  });

  it("descendent tasks should also be deleted", async function() {
    let dummyParentTask = await Task.create({ title: "abc" });
    const dummyChildTask = await Task.create({
      title: "def",
      parent: dummyParentTask.id
    });
    const dummyGrandchildTask = await Task.create({
      title: "def",
      parent: dummyChildTask.id
    });

    dummyParentTask = await Task.findById(dummyParentTask.id);

    dummyParentTask.remove();

    await Promise.all([
      new Promise((resolve, reject) => {
        setTimeout(() => {
          Task.findById(dummyChildTask.id, (err, res) => {
            try {
              expect(res).to.be.null;
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }, 1000);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          Task.findById(dummyGrandchildTask.id, (err, res) => {
            try {
              expect(res).to.be.null;
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }, 1000);
      })
    ]);
  });
});
