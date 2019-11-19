require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

const { createDummyProject } = require("../testHelpers");

chai.should();
chai.use(chaiHttp);

const validProject = { title: "123" };

const validProjectUpdate = { title: "abc" };

/**
 *    Test project creation
 * */
describe("POST to /api/projects", () => {
  let dummyProject, response;
  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai
      .request(app)
      .post("/api/projects")
      .send(validProject);
  });

  it("it should have status 201", () => response.should.have.status(201));

  it("it should be TYPE = JSON", () => response.should.be.json);
});

/**
 *  Test project retrieval
 */
describe("GET to /api/projects/:project_id", () => {
  let dummyProject, response;
  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai.request(app).get(`/api/projects/${dummyProject.id}`);
  });

  it("it should have status 200", () => response.should.have.status(200));

  it("it should be TYPE = JSON", () => response.should.be.json);
});

/**
 *  Test project modification
//  */
describe("PUT to /api/projects/:project_id", () => {
  let dummyProject, response;
  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai
      .request(app)
      .put(`/api/projects/${dummyProject.id}`)
      .send(validProjectUpdate);
  });

  it("it should have status 204", () => response.should.have.status(204));
});

// /**
//  *  Test project deletion
//  */
describe("DELETE to /api/projects/:project_id", () => {
  let dummyProject, response;
  before(async function() {
    dummyProject = await createDummyProject();
    response = await chai
      .request(app)
      .delete(`/api/projects/${dummyProject.id}`);
  });

  it("it should have status 204", () => response.should.have.status(204));
});
