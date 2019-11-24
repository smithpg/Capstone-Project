require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../app.js");

chai.should();
chai.use(chaiHttp);

/**
 *  Test that request to root path returns .html file
 */
describe("GET to /", async () => {
  let response;

  before(async () => {
    response = await chai.request(app).get("/");
  });

  it("it should have status 200", () => response.should.have.status(200));

  it("it should be TYPE = HTML", () => response.should.be.html);
});
