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
describe("GET to /", () => {
  const eventualRes = chai.request(app).get("/");

  it("it should have status 200", done => {
    eventualRes.then(res => {
      res.should.have.status(200);
      done();
    });
  });
  it("it should be TYPE = HTML", done => {
    eventualRes.then(res => {
      res.should.be.html;
      done();
    });
  });
});
