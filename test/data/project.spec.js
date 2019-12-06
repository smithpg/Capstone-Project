const testHelpers = require("../testHelpers");
const Task = require("../../data/task");
const Report = require("../../data/report");
const Project = require("../../data/project");

const { expect } = require("chai");

describe("On deletion of a project document", () => {
  let dummyProject;

  beforeEach(async () => {
    dummyProject = await testHelpers.createDummyProject(15);
  });

  afterEach(testHelpers.deleteCollections); // drop everything

  it("associated tasks should also be deleted", async function() {
    dummyProject.delete();

    await testHelpers.delay(1000);

    return Task.find({ project: dummyProject.id }, (err, res) => {
      expect(res).to.be.empty;
    });
  });
});

describe("generateProjectTree()", () => {
  let dummyProject;
  const numNodesInDummyProject = 150;

  before(async () => {
    dummyProject = await testHelpers.createDummyProject(numNodesInDummyProject);
  });

  after(testHelpers.deleteCollections); // drop everything

  it("should return fully populated tree", async function() {
    const returnedTree = await dummyProject.doc.generateProjectTree();

    expect(testHelpers.countNodes(returnedTree)).to.equal(
      numNodesInDummyProject
    );
  });
});
