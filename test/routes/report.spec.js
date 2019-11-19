require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app.js");

const helpers = require("../testHelpers");

chai.should();
chai.use(chaiHttp);

describe("POST to /api/tasks/:task_id/reports", () => {
  let dummyProject, response;

  before(async () => {
    dummyProject = await helpers.createDummyProject();

    response = await chai
      .request(app)
      .post(
        `/api/projects/${dummyProject.id}/tasks/${dummyProject.descendentTaskId}/reports`
      )
      .send(validReport);
  });

  after(helpers.teardownDb);

  it("it should have status 201", () => {
    response.should.have.status(201);
  });

  it("it should be TYPE = JSON", () => response.should.be.json);
});

const validReport = { progress: 3, remaining: 2 };
