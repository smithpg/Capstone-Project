require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const _ = require("lodash");
const app = require("../app.js");

chai.should();
chai.use(chaiHttp);

/**   Example of basic test 

    describe("POST to /{routeName} with valid payload", () => {
        it("it should have status 201", done => {
          chai
            .request(app)
            .post(`/{route}`)
            .send(validPayload)
            .end((err, res) => {
              res.should.have.status(201);  
              done();
            });
        });
      });
 * 
 * 
 */
