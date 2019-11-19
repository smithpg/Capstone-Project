const helpers = require("../testHelpers");
const Task = require("../../data/task");
const Report = require("../../data/report");

const { expect } = require("chai");

describe("On creation of a report document", () => {
  afterEach(helpers.teardownDb); // drop everything
  it("A reference to the report is added to the appropriate task document", async function() {
    let dummyTask = await Task.create({ title: "abc" });

    const dummyReport = await Report.create({
      task: dummyTask.id,
      date: Date.now(),
      remaining: 10,
      progress: 10
    });

    dummyTask = await Task.findById(dummyTask.id);
    expect(dummyTask.reports.includes(dummyReport.id)).to.be.true;
  });
});
