const { expect } = require("chai");

describe("Database setup", () => {
  it("can connect to the dev db", done => {
    const { connection: eventualConnection } = require("../../data");
    eventualConnection.then(() => done()).catch(err => done(err));
  });
});
