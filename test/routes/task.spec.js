require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

const { createDummyProject } = require("../testHelpers");

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

  it("it should have status 204", () => response.should.have.status(204));
});

/**
 *  Test that task can be deleted
 */
describe("DELETE to /api/tasks/:task_id", () => {
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
