const helpers = require("../testHelpers");
const Task = require("../../data/task");
const Report = require("../../data/report");
const Project = require("../../data/project");

const { expect } = require("chai");

describe("On deletion of a project document", () => {
  let dummyProject;

  beforeEach(async () => {
    dummyProject = await helpers.createDummyProject(15);
  });

  afterEach(helpers.teardownDb); // drop everything

  it("associated tasks should also be deleted", async function() {
    dummyProject.delete();

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        Task.find({ project: dummyProject.id }, (err, res) => {
          try {
            expect(res).to.be.empty;
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }, 1000);
    });
  });
});

describe("generateProjectTree()", () => {
  let dummyProject;
  const numNodesInDummyProject = 150;

  before(async () => {
    dummyProject = await helpers.createDummyProject(numNodesInDummyProject);
  });

  after(helpers.teardownDb); // drop everything

  it("should return fully populated tree", async function() {
    const returnedTree = await dummyProject.doc.generateProjectTree();

    expect(helpers.countNodes(returnedTree)).to.equal(numNodesInDummyProject);
  });
});
