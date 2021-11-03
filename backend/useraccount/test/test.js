const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("..");
const app = server.app;
// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("Users", function () {
	this.timeout(5000);
	describe("tests", () => {
		
		it("should register a user", (done) => {
			chai
				.request(app)
				.post(`/api/user/register`).send({username: "testuser", currency: 1000, email: "e0411063@u.nus.edu", password: "xxx123!!X", confirmpassword: "xxx123!!X"})
				.end((err, res) => {
					res.should.have.status(200);
					expect(res.body.username).to.equal(
						"testuser"
					)
					expect(res.body.currency).to.equal(
						1000
                    )
                    expect(res.body.email).to.equal(
						"e0411063@u.nus.edu"
					)
					done();
				});
		});

		it("should return an error as email and username already exists", (done) => {
            chai
                .request(app)
                .post(`/api/user/register`).send({ username: "testuser", currency: 1000, email: "e0411063@u.nus.edu", password: "xxx123!!X", confirmpassword: "xxx123!!X" })
                .end((err, res) => {
                    res.should.have.status(400);
					expect(res.body.email).to.equal("Email already exists");
					expect(res.body.username).to.equal("Username already exists");
                    expect(res.body.valid).to.equal("false");
					done();
				});
		});
		it("should delete the user", (done) => {
            chai
                .request(app)
                .delete(`/api/user/testuser`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("User deleted");
					done();
				});
		});

		it("return error as user does not exist", (done) => {
            chai
                .request(app)
                .delete(`/api/user/testuser`)
                .end((err, res) => {
					res.should.have.status(400);
                    expect(res.body.status).to.equal("error");
                    expect(res.body.message).to.equal("User does not exist");
					done();
				});
		});
	});
});
