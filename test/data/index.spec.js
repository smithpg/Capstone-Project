const { expect } = require("chai");

describe("Database setup", () => {
  it("can connect to the dev db", async () => {
    const connection = await require("../../data").connection; // establish that this promise doesn't reject
  });
});
