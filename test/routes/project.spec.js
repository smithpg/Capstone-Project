require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const _ = require("lodash");
const app = require("../../app.js");

const testHelpers = require("../testHelpers");
const jwt = require("jsonwebtoken");

chai.should();
chai.use(chaiHttp);

const validProject = { title: "123" };
const validProjectUpdate = { title: "abc" };

describe("Routes under /api/projects:", () => {
  beforeEach(async function() {
    await testHelpers.seedDB();
  });
  afterEach(async function() {
    await testHelpers.teardownDb();
  });

  describe("POST to /api/projects", () => {
    let response;
    before(async function() {
      sinon.stub(jwt, "verify").returns({ _id: 11111111 });
      sinon
        .stub(require("../../middleware/auth"), "checkPermission")
        .returns(true);
      response = await chai
        .request(app)
        .post("/api/projects")
        .set("Authorization", "Bearer odfijsdfoijsdf") // Auth middleware throws without setting this
        .send(validProject);
    });

    it("it should have status 201", () => response.should.have.status(201));

    it("it should be TYPE = JSON", () => response.should.be.json);
  });
});

/**
 *    Test project creation
 * */
// describe("POST to /api/projects", () => {
//   let response;
//   before(async function() {
//     response = await chai
//       .request(app)
//       .set("Authorization", `Bearer ${validUserToken}`)
//       .post("/api/projects")
//       .send(validProject);
//   });

//   after(testHelpers.teardownDb);

//   it("it should have status 201", () => response.should.have.status(201));

//   it("it should be TYPE = JSON", () => response.should.be.json);
// });

// /**
//  *  Test project retrieval
//  */
// describe("GET to /api/projects/:project_id", () => {
//   let dummyProject, response;
//   before(async function() {
//     dummyProject = await testHelpers.createDummyProject();
//     response = await chai
//       .request(app)
//       .set("Authorization", `Bearer ${validUserToken}`)
//       .get(`/api/projects/${dummyProject.id}`);
//   });
//   after(testHelpers.teardownDb);

//   it("it should have status 200", () => response.should.have.status(200));

//   it("it should be TYPE = JSON", () => response.should.be.json);
// });

// /**
//  *  Test project modification
//  */
// describe("PUT to /api/projects/:project_id", () => {
//   let dummyProject, response;
//   before(async function() {
//     dummyProject = await testHelpers.createDummyProject();
//     response = await chai
//       .request(app)
//       .set("Authorization", `Bearer ${validUserToken}`)
//       .put(`/api/projects/${dummyProject.id}`)
//       .send(validProjectUpdate);
//   });
//   after(testHelpers.teardownDb);

//   it("it should have status 204", () => response.should.have.status(204));
// });

// /**
//  *  Test project deletion
//  */
// describe("DELETE to /api/projects/:project_id", () => {
//   let dummyProject, response;
//   before(async function() {
//     dummyProject = await testHelpers.createDummyProject();
//     response = await chai
//       .request(app)
//       .set("Authorization", `Bearer ${validUserToken}`)
//       .delete(`/api/projects/${dummyProject.id}`);
//   });
//   after(testHelpers.teardownDb);

//   it("it should have status 204", () => response.should.have.status(204));
// });
