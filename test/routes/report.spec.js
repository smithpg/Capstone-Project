require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../../app.js");

chai.should();
chai.use(chaiHttp);

/**
 *  Create a dummy task for testing purposes
 */

(async function() {
  const taskId = await createDummyTask();

  /**
   *    Test task creation
   * */

  describe("POST to /api/tasks/:task_id/reports", () => {
    const eventualRes = chai
      .request(app)
      .post(`/api/tasks/${taskId}/reports`)
      .send(validReport);

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
})();

function createDummyTask() {
  //TODO: This function should make use of create method on
  // the appropriate model

  taskId = "23048203"; // totally fake for now

  return taskId;
}

const validReport = { progress: 3, remaining: 2 };
