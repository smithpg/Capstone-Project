require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app.js");

const helpers = require("../testHelpers");

chai.should();
chai.use(chaiHttp);

describe("POST to /api/projects/:project_id/tasks/:task_id/reports", () => {
  let dummyProject, response;

  before(async () => {
    dummyProject = await helpers.createDummyProject();

    response = await chai
      .request(app)
      .post(
        `/api/projects/${dummyProject.id}/tasks/${dummyProject.descendentTaskId}/reports`
      )
      .send(validReport);
    console.log(response.body);
  });

  after(helpers.teardownDb);

  it("it should have status 201", () => {
    response.should.have.status(201);
  });

  it("it should be TYPE = JSON", () => response.should.be.json);
});

describe("PUT to /api/projects/:project_id/tasks/:task_id/reports/report_id", () => {
  let dummyProject, response;

  before(async () => {
    dummyProject = await helpers.createDummyProject();

    const report = await helpers.createDummyReport(
      dummyProject.descendentTaskId
    );

    response = await chai
      .request(app)
      .put(
        `/api/projects/${dummyProject.id}/tasks/${dummyProject.descendentTaskId}/reports/${report.id}`
      )
      .send(validReportUpdate);

    console.log(response.body);
  });

  after(helpers.teardownDb);

  it("it should have status 204", () => {
    response.should.have.status(204);
  });
});

const validReport = { progress: 3, remaining: 2, date: Date.now() };
const validReportUpdate = { progress: 99, remaining: 0 };
