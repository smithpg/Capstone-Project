require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const _ = require("lodash");

const testHelpers = require("../testHelpers");

let testContext = {};

chai.should();
chai.use(chaiHttp);

const validProject = { title: "123" };
const validProjectUpdate = { title: "abc" };

describe("Routes under /api/projects:", () => {
  // Clear the cache to ensure we get a fresh instance of `app`
  testHelpers.clearRequireCache();

  // Swap out middleware for a stub that forcibly attaches
  // the user we want to use to the req object
  const authMiddleware = require("../../middleware/auth");
  sinon
    .stub(authMiddleware, "userIsLoggedIn")
    .callsFake(function(req, res, next) {
      req.user = currentTestUser;
      next();
    });
  const app = require("../../app.js");

  before(async function() {
    await testHelpers.deleteCollections(); // ensure db is a blank slate
    testContext = await testHelpers.seedDB();
  });

  after(async function() {
    await testHelpers.deleteCollections();
  });

  /**
   *    Test project creation
   * */

  describe("POST to /api/projects", () => {
    let response;

    before(async function() {
      useTestUser(testContext.readUser);

      console.log(require("../../middleware/auth").userIsLoggedIn.toString());
      response = await chai
        .request(app)
        .post("/api/projects")
        .send(validProject);
    });

    it("it should have status 201", () => response.should.have.status(201));

    it("it should be TYPE = JSON", () => response.should.be.json);
  });

  /**
   *  Test retrieval of a user's accessible projects
   */

  describe("GET to /api/projects/:project_id", () => {
    let response;

    before(async function() {
      useTestUser(testContext.adminUser);

      response = await chai.request(app).get(`/api/projects`);
    });

    it("it should have status 200", () => response.should.have.status(200));
    it("it should be TYPE = JSON", () => response.should.be.json);
    it("should contain all two projects that this user can access", () => {
      chai.expect(response.body.length).to.equal(2);
    });
  });

  /**
   *  Test individual project retrieval
   */

  describe("GET to /api/projects/:project_id", () => {
    let dummyProject, response;

    before(async function() {
      useTestUser(testContext.readUser);

      response = await chai
        .request(app)
        .get(`/api/projects/${testContext.project.id}`);
    });

    it("it should have status 200", () => response.should.have.status(200));

    it("it should be TYPE = JSON", () => response.should.be.json);
  });

  /**
   *  Test project modification
   */
  describe("PUT to /api/projects/:project_id", () => {
    let response;
    before(async function() {
      useTestUser(testContext.adminUser);
      response = await chai
        .request(app)
        .put(`/api/projects/${testContext.project.id}`)
        .send(validProjectUpdate);
    });

    it("it should have status 204", () => response.should.have.status(204));
  });

  /**
   *  Test project deletion
   */
  describe("DELETE to /api/projects/:project_id", () => {
    let response;
    before(async function() {
      useTestUser(testContext.adminUser);
      response = await chai
        .request(app)
        .delete(`/api/projects/${testContext.project.id}`);
    });

    it("it should have status 204", () => response.should.have.status(204));
  });
});

let currentTestUser;
function useTestUser(user) {
  currentTestUser = user;
}
