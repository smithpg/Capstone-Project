require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

chai.should();
chai.use(chaiHttp);


(async function() {
  /**
   *  Create a dummy task for testing purposes
   */
  const taskId = await createDummyTask();
  const projectId = await createDummyProject();

  /**
   *    Test task creation
   * */

  describe("POST to /api/projects/:project_id/tasks", () => {
    const eventualRes = chai
      .request(app)
      .post(`/api/projects/${projectId}`)
      .send(validTask);

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
   *  Test that task can be modified
   */
  describe("PUT to /api/tasks/:task_id", () => {
    const eventualRes = chai
      .request(app)
      .put(`/api/tasks/${taskId}`)
      .send(validTaskUpdate);

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
   *  Test that task can be deleted
   */
  describe("DELETE to /api/tasks/:task_id", () => {
    const eventualRes = chai.request(app).delete(`/api/tasks/${taskId}`);

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

function createDummyTask() {
  //TODO: This function should make use of create method on
  // the appropriate model

  taskId = "23048203"; // totally fake for now

  return taskId;
}

function createDummyProject() {
  //TODO: This function should make use of create method on
  // the appropriate model

  projectId = "23048203"; // totally fake for now

  return projectId;
}

const validTask = { name: "lorem ipsum" };
const validTaskUpdate = { name: "dolor sit" };
