const helpers = require("../testHelpers");
const Task = require("../../data/task");
const Report = require("../../data/report");

const { expect } = require("chai");

describe("On creation of a task document", () => {
  let dummyOriginalParentTask, dummyChildTask;

  beforeEach(async () => {
    dummyOriginalParentTask = await Task.create({ title: "abc" });
    dummyChildTask = await Task.create({
      title: "def",
      parent: dummyOriginalParentTask.id
    });
  });

  afterEach(helpers.teardownDb); // drop everything

  it("new task's id should be added to parent task document", async function() {
    // Get a new document instance that will reflect most recent
    // updates
    dummyOriginalParentTask = await Task.findById(dummyOriginalParentTask.id);

    expect(dummyOriginalParentTask.children).to.include(dummyChildTask.id);
  });
});

describe("On deletion of a task document", () => {
  afterEach(helpers.teardownDb); // drop everything
  it("associated reports should also be deleted", async function() {
    let dummyOriginalParentTask = await Task.create({ title: "abc" });

    const dummyReport = await Report.create({
      task: dummyOriginalParentTask.id,
      date: Date.now(),
      remaining: 10,
      progress: 10
    });

    dummyOriginalParentTask = await Task.findById(dummyOriginalParentTask.id);

    dummyOriginalParentTask.remove();

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
    let dummyOriginalParentTask = await Task.create({ title: "abc" });
    const dummyChildTask = await Task.create({
      title: "def",
      parent: dummyOriginalParentTask.id
    });
    const dummyGrandchildTask = await Task.create({
      title: "def",
      parent: dummyChildTask.id
    });

    dummyOriginalParentTask = await Task.findById(dummyOriginalParentTask.id);

    dummyOriginalParentTask.remove();

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

describe("When a task's parent is updated'", () => {
  let dummyOriginalParentTask, dummyChildTask, dummyTargetParentTask;

  before(async () => {
    dummyOriginalParentTask = await Task.create({ title: "abc" });
    dummyTargetParentTask = await Task.create({ title: "def" });
    dummyChildTask = await Task.create({
      title: "ghi",
      parent: dummyOriginalParentTask.id
    });

    dummyChildTask.parent = dummyTargetParentTask.id;
    await dummyChildTask.save();
    await helpers.delay(1000);
  });

  // after(helpers.teardownDb); // drop everything

  it("the old parent should no longer have the task's id in its `children` array", async function() {
    dummyOriginalParentTask = await Task.findById(dummyOriginalParentTask.id); // retrieve up-to-date record

    expect(dummyOriginalParentTask.children).not.to.include(dummyChildTask.id);
  });

  it("the new parent should have the task's id in its `children` array", async function() {
    newParentTask = await Task.findById(dummyTargetParentTask.id); // retrieve up-to-date record

    expect(newParentTask.children).to.include(dummyChildTask.id);
  });
});
