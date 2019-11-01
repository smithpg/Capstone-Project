require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

chai.should();
chai.use(chaiHttp);

(async function() {
  const projectId = await createDummyProject();

  /**
   *    Test project creation
   * */

  describe("POST to /api/projects", () => {
    const eventualRes = chai
      .request(app)
      .post("/api/projects")
      .send(validProject);

    it("it should have status 201", done => {
      eventualRes.then(res => {
        try {
          res.should.have.status(201);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("it should be TYPE = JSON", done => {
      eventualRes.then(res => {
        try {
          res.should.be.json;
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  /**
   *  Test project retrieval
   */
  describe("GET to /api/projects/:project_id", () => {
    const eventualRes = chai.request(app).get(`/api/projects/${projectId}`);

    it("it should have status 200", done => {
      eventualRes.then(res => {
        try {
          res.should.have.status(200);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it("it should be TYPE = JSON", done => {
      eventualRes.then(res => {
        try {
          res.should.be.json;
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  /**
   *  Test project modification
   */
  describe("PUT to /api/projects/:project_id", () => {
    const eventualRes = chai
      .request(app)
      .put(`/api/projects/${projectId}`)
      .send(validProjectUpdate);

    it("it should have status 204", done => {
      eventualRes.then(res => {
        try {
          res.should.have.status(204);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  /**
   *  Test project deletion
   */
  describe("DELETE to /api/projects/:project_id", () => {
    const eventualRes = chai.request(app).delete(`/api/projects/${projectId}`);

    it("it should have status 204", done => {
      eventualRes.then(res => {
        try {
          res.should.have.status(204);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
})();

function createDummyProject() {
  //TODO: This function should make use of create method on
  // the appropriate model

  projectId = "23048203"; // totally fake for now

  return projectId;
}

const validProject = { name: "123" };

const validProjectUpdate = { name: "abc" };
