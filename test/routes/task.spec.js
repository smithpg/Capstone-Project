require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

const { createDummyProject } = require("../testHelpers");
const { Task } = require("../../data");

chai.should();
chai.use(chaiHttp);

/**
 *    Test task creation
 * */

describe("POST to /api/projects/:project_id/tasks", () => {
  let dummyProject, response;

  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai
      .request(app)
      .post(`/api/projects/${dummyProject.id}/tasks`)
      .send(validTask);
  });

  after(async function() {
    dummyProject.delete();
  });

  it("it should have status 201", () => {
    response.should.have.status(201);
  });

  it("it should be TYPE = JSON", () => {
    response.should.be.json;
  });
});

/**
 *  Test that task can be modified
 */
describe("PUT to /api/projects/:project_id/tasks/:task_id", () => {
  let dummyProject, response;

  before(async function() {
    dummyProject = await createDummyProject();

    response = await chai
      .request(app)
      .put(
        `/api/projects/${dummyProject.id}/tasks/${dummyProject.descendentTaskId}`
      )
      .send(validTaskUpdate);

    console.dir(response.body);
  });

  after(async function() {
    dummyProject.delete();
  });

  it("it should have status 204", async () => {
    response.should.have.status(204);
  });
  it("the document should have expected modifications", async () => {
    const affectedDocument = await Task.findById(dummyProject.descendentTaskId);
    const updateTookAffect = Object.keys(affectedDocument).reduce(
      (accum, key) => {
        //NB: this check only works on assumption task model doesn't alter
        // update values in any way (e.g. inside a setter) before modifying document

        return affectedDocument[key] !== validTaskUpdate[key];
      },
      true
    );

    chai.expect(updateTookAffect).to.be.true;
  });
});

/**
 *  Test that task can be deleted
 */
describe("DELETE to /api/tasks/:task_id", () => {
  let dummyProject, response;

  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai
      .request(app)
      .put(
        `/api/projects/${dummyProject.id}/tasks/${dummyProject.descendentTaskId}`
      )
      .send(validTaskUpdate);
  });
  after(async function() {
    dummyProject.delete();
  });
  it("it should have status 204", () => response.should.have.status(204));
});

const validTask = { title: "lorem ipsum" };
const validTaskUpdate = { title: "dolor sit" };
